# web-ifc-experiment

⚠️ This repo is not maintained. Used what I learned here to make a 3d application at work

⚠️ Will not be maintained - but might rebuilt it later if I have time takign all I learned from 3d application at work - if I dont get to open source work application. But again that was not using IFC, but backend parsing of RVM files and custom format from azure blob storage

---

This was a repo where I tried gpu picking, but it used to much memory on very large models, so moved away from it
Parser used is [web-ifc](https://github.com/tomvandig/web-ifc)

Work here might end up as seperate package or part of [web-ifc-viewer](https://github.com/agviegas/web-ifc-viewer)

Warning 💣⚠️🪖
* This will have a lot of weird stuff, there have been no focus at all on how code is, just try and get it to work.
* Spagetti code is a good word for it 😂🎉😎
* Its pretty much been a testign ground for another project

Atm its not something you can install, most work will go into helper viewController class - located under folder scr/viewer

Progress Sample [live sample](https://vegarringdal.github.io/web-ifc-experiment/)

What I want to have working (and might fail at getting to work):
* [x] select items/picking to get data about item
  * [x] and highlight (limited data atm, since I will use database to get data from TAG property)
  * [x] select all elements with same ID  (before this, just simple parts get highlighted)
* [x] hide items
* [x] select many files and load them
* [x] center items when loading (default atm) - uses first file as default for next ones
* [x] show data of selected
* [x] multi select by holding CTRL 
  * [x] deselect when clicking same item (when using CTRL key)
* [x] show all (hidden)
* [x] hide not selected
* [x] use spacenavigator
* [x] set focus to last selected with button
  * [ ] set focus on selected when you click on a item
* [x] clear scene (so you can load new, else it will add)
* [ ] enable wireframe on material
* [ ] some selection three
* [x] simple clipping tools
  * [x] with working selection/picking to get data about item
* [x] simple ground plane
* [ ] merge geometry buffer per expressID/color to same memory (might kill normals with this..)
* [ ] clean up selection/hide spagetti :-)

## how to use

* clone repo
* npm install
* npm start
* open browser to [localhost](http://localhost)

## build github pages site
* npm run build




