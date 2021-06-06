/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * Space Navigator Controls Component for A-Frame.
 *
 * Forked from:
 * https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
 *
 */

import { Vector3, Euler, Object3D } from "three";

const MAX_DELTA = 200, // ms
    ROTATION_EPS = 0.0,
    DEFAULT_FOV = 60,
    DEG_TO_RAD = (1 / 180) * Math.PI,
    RAD_TO_DEG = 180 / Math.PI;

// main

export class SpaceNavigator {
    schema: any;
    constructor(args: any) {
        this.schema = {
            // Enable/disable features
            enabled: { default: true },
            movementEnabled: { default: true },
            lookEnabled: { default: true },
            rollEnabled: { default: true },
            invertPitch: { default: false },
            fovEnabled: { default: true },
            fovMin: { default: 2 },
            fovMax: { default: 115 },

            // Constants
            rotationSensitivity: { default: 0.05 },
            movementEasing: { default: 3 },
            movementAcceleration: { default: 700 },
            fovSensitivity: { default: 0.01 },
            fovEasing: { default: 3 },
            fovAcceleration: { default: 5 },
            invertScroll: { default: false }
        };

        args = args || {};
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const this_ = this;

        this_.data = {};
        Object.keys(this_.schema).forEach(function (argName) {
            if (args[argName] !== undefined) {
                // use argument
                this_.data[argName] = args[argName];
            } else {
                // set default
                this_.data[argName] = this_.schema[argName].default;
            }
        });

        this_.init();
    }

    position: Vector3;
    movement: Vector3;
    movementVelocity: Vector3;
    movementDirection: Vector3;
    rotation: Euler;
    pitch: Object3D;
    roll: Object3D;
    yaw: Object3D;
    fov: number;
    fovVelocity: number;
    buttons: any;
    scrollDelta: number;
    _previousUpdate: number;
    data: any;
    scroll: number;
    el: any;
    _getMovementVector: any;
    _updateRotation: any;
    _updateFov: any;
    spaceNavigatorId: any;

    /**
     * Called once when component is attached. Generally for initial setup.
     */

    init() {
        // Movement
        this.position = new Vector3(0, 0, 0);
        this.movement = new Vector3(0, 0, 0);
        this.movementVelocity = new Vector3(0, 0, 0);
        this.movementDirection = new Vector3(0, 0, 0);

        // Rotation
        this.rotation = new Euler(0, 0, 0, "YXZ");
        this.pitch = new Object3D();
        this.roll = new Object3D();
        this.yaw = new Object3D();
        this.yaw.position.y = 10;
        this.yaw.add(this.pitch);

        // FOV
        this.fov = DEFAULT_FOV;
        this.fovVelocity = 0;

        // Button state
        this.buttons = {};

        // scroll wheel
        this.scrollDelta = 0;

        // time
        this._previousUpdate = performance.now();

        if (!this.getSpaceNavigator()) {
            console.warn("Space Navigator not found. Connect and press any button to continue.");
        }
    }

    /**
     * THREE specific: Called on each iteration of main render loop.
     */
    update() {
        const time = performance.now();
        const dt = time - this._previousUpdate;
        this._previousUpdate = time;

        this.updateRotation();
        this.updatePosition(dt);
        if (this.data.fovEnabled) this.updateFov(dt);
    }

    /*******************************************************************
     * Movement
     */

    updatePosition(dt: number) {
        const data = this.data;
        const acceleration = data.movementAcceleration;
        const easing = data.movementEasing;
        const velocity = this.movementVelocity;
        const spaceNavigator = this.getSpaceNavigator();

        // If data has changed or FPS is too low
        // we reset the velocity
        if (dt > MAX_DELTA) {
            velocity.x = 0;
            velocity.x = 0;
            velocity.z = 0;
            return;
        }

        velocity.z -= (velocity.z * easing * dt) / 1000;
        velocity.x -= (velocity.x * easing * dt) / 1000;
        velocity.y -= (velocity.y * easing * dt) / 1000;

        if (data.enabled && data.movementEnabled && spaceNavigator) {
            /*
             * 3dconnexion space navigator position axes
             *
             * "right handed coordinate system"
             * 0: - left / + right (pos: X axis pointing to the right)
             * 1: - backwards / + forward (pos: Z axis pointing forwards)
             * 2: - up / + down (pos: Y axis pointing down)
             */

            const xDelta = spaceNavigator.axes[0],
                yDelta = spaceNavigator.axes[2],
                zDelta = spaceNavigator.axes[1];

            velocity.x += (xDelta * acceleration * dt) / 1000;
            velocity.z += (zDelta * acceleration * dt) / 1000;
            velocity.y -= (yDelta * acceleration * dt) / 1000;
        }

        const movementVector = this.getMovementVector(dt);

        this.movement.copy(movementVector);
        this.position.add(movementVector);
    }

    getMovementVector(dt: number) {
        if (this._getMovementVector) return this._getMovementVector(dt);

        const euler = new Euler(0, 0, 0, "YXZ"),
            rotation = new Vector3(),
            direction = this.movementDirection,
            velocity = this.movementVelocity;

        this._getMovementVector = function (dt: number) {
            rotation.set(
                this.rotation.x * RAD_TO_DEG,
                this.rotation.y * RAD_TO_DEG,
                this.rotation.z * RAD_TO_DEG
            );

            direction.copy(velocity);
            direction.multiplyScalar(dt / 1000);
            if (!rotation) return direction;
            euler.set(rotation.x * DEG_TO_RAD, rotation.y * DEG_TO_RAD, rotation.z * DEG_TO_RAD);
            direction.applyEuler(euler);
            return direction;
        };

        return this._getMovementVector(dt);
    }

    /*******************************************************************
     * Rotation
     */

    updateRotation() {
        if (this._updateRotation) return this._updateRotation();

        const initialRotation = new Vector3(),
            prevInitialRotation = new Vector3(),
            prevFinalRotation = new Vector3();

        let tCurrent,
            tLastLocalActivity = 0,
            tLastExternalActivity = 0;

        const rotationEps = 0.0001,
            debounce = 500;

        this._updateRotation = function () {
            const spaceNavigator = this.getSpaceNavigator();

            if (!this.data.lookEnabled || !spaceNavigator) return;

            tCurrent = Date.now();

            initialRotation.set(
                this.rotation.x * RAD_TO_DEG,
                this.rotation.y * RAD_TO_DEG,
                this.rotation.z * RAD_TO_DEG
            );

            // If initial rotation for this frame is different from last frame, and
            // doesn't match last spaceNavigator state, assume an external component is
            // active on this element.
            if (
                initialRotation.distanceToSquared(prevInitialRotation) > rotationEps &&
                initialRotation.distanceToSquared(prevFinalRotation) > rotationEps
            ) {
                prevInitialRotation.copy(initialRotation);
                tLastExternalActivity = tCurrent;
                return;
            }

            prevInitialRotation.copy(initialRotation);

            // If external controls have been active in last 500ms, wait.
            if (tCurrent - tLastExternalActivity < debounce) return;

            /*
             * 3dconnexion space navigator rotation axes
             *
             * "right handed coordinate system"
             * 3: - pitch down / + pitch up (rot: X axis clock wise)
             * 4: - roll right / + roll left (rot: Z axis clock wise)
             * 5: - yaw right / + yaw left (rot: Y axis clock wise)
             */

            const delta = new Vector3(
                spaceNavigator.axes[3],
                spaceNavigator.axes[5],
                spaceNavigator.axes[4]
            );

            if (delta.x < ROTATION_EPS && delta.x > -ROTATION_EPS) delta.z = 0;
            if (delta.y < ROTATION_EPS && delta.y > -ROTATION_EPS) delta.y = 0;
            if (delta.z < ROTATION_EPS && delta.z > -ROTATION_EPS) delta.x = 0;

            if (this.data.invertPitch) delta.x *= -delta.x;

            // If external controls have been active more recently than spaceNavigator,
            // and spaceNavigator hasn't moved, don't overwrite the existing rotation.
            if (tLastExternalActivity > tLastLocalActivity && !delta.lengthSq()) return;

            delta.multiplyScalar(this.data.rotationSensitivity);

            this.pitch.rotation.x += delta.x;
            this.yaw.rotation.y -= delta.y;
            this.roll.rotation.z += delta.z;

            this.rotation.set(
                this.pitch.rotation.x,
                this.yaw.rotation.y,
                this.data.rollEnabled ? this.roll.rotation.z : 0
            );

            prevFinalRotation.set(
                this.rotation.x * RAD_TO_DEG,
                this.rotation.y * RAD_TO_DEG,
                this.rotation.z * RAD_TO_DEG
            );

            tLastLocalActivity = tCurrent;
        };

        return this._updateRotation();
    }

    updateFov(dt: number) {
        if (this._updateFov) return this._updateFov(dt);

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        let previousScroll = 0;

        this._updateFov = function (dt: number) {
            const fovFromAttribute: any = null;
            let fov = fovFromAttribute ? parseFloat(fovFromAttribute) : self.fov;
            const lensDistance = 1 / Math.tan((fov / 2) * DEG_TO_RAD);
            // easing
            if (dt > 1000) return;
            self.fovVelocity =
                self.fovVelocity - ((self.fovVelocity * dt) / 1000) * self.data.fovEasing;
            if (self.fovVelocity > -0.001 && self.fovVelocity < 0.001) self.fovVelocity = 0;
            // acceleration
            const scrollDelta = previousScroll - self.scroll;
            self.fovVelocity += ((scrollDelta * dt) / 1000) * self.data.fovAcceleration;
            // applay
            const newLensDistance = lensDistance + self.fovVelocity * self.data.fovSensitivity;
            //const newFov = Math.min(140, Math.max(10, Math.atan( 1 / newLensDistance ) * 2))
            fov = Math.atan(1 / newLensDistance) * 2 * RAD_TO_DEG;
            if (fov > self.data.fovMin && fov < self.data.fovMax) {
                self.fov = fov;
            }
            previousScroll = self.scroll;
        };

        return this._updateFov(dt);
    }

    /*******************************************************************
     * SpaceNavigator state
     */

    /**
     * Returns SpaceNavigator instance attached to the component. If connected,
     * a proxy-controls component may provide access to spaceNavigator input from a
     * remote device.
     *
     * @return {SpaceNavigator}
     */
    getSpaceNavigator() {
        // use local space navigator

        if (!navigator.getGamepads) {
            console.error(
                "Gamepad API is not supported on this browser. Please use Firefox or Chrome."
            );
            return false;
        }

        if (this.spaceNavigatorId === undefined) {
            // find space navigator
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const this_ = this;
            const gamepadList = navigator.getGamepads();
            Object.keys(gamepadList).forEach(function (i) {
                const gamepadName = gamepadList[i] ? gamepadList[i].id : null;
                if (
                    gamepadName &&
                    (gamepadName.toLowerCase().indexOf("spacenavigator") > -1 ||
                        gamepadName.toLowerCase().indexOf("space navigator") > -1 ||
                        gamepadName.toLowerCase().indexOf("spacemouse wireless") > -1)
                ) {
                    this_.spaceNavigatorId = i;
                }
            });
        }

        return navigator.getGamepads()[this.spaceNavigatorId];
    }

    /**
     * Returns true if Space Navigator is currently connected to the system.
     * @return {boolean}
     */
    isConnected() {
        const spaceNavigator = this.getSpaceNavigator();
        return !!(spaceNavigator && spaceNavigator.connected);
    }

    /**
     * Returns a string containing some information about the controller. Result
     * may vary across browsers, for a given controller.
     * @return {string}
     */
    getID() {
        //@ts-ignore
        return this.getSpaceNavigator().id;
    }
}
