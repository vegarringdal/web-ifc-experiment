# web-ifc-experiment

This was a repo where I tried gpu picking, but it used to much memory on very large models, so moved away from it
Parser used is [web-ifc](https://github.com/tomvandig/web-ifc)

Work here might end up as seperate package or part of [web-ifc-viewer](https://github.com/agviegas/web-ifc-viewer)

Warning, this will have a lot of weird stuff :-)

Atm its not something you can install, most work will go into helper viewController class - located under folder scr/viewer

Progress Sample [live sample](https://vegarringdal.github.io/web-ifc-experiment/)

What I want to have working (and might fail at getting to work):
* [x] select items/picking to get data about item
  * [x] and highlight (limited data atm, since I will use database to get data from TAG property)
* [ ] hide items
* [x] select many files and load them
* [x] center items when loading (default atm) - uses first file as default for next ones
* [x] show data of selected
* [x] multi select by holding CTRL 
  * [ ] deselect when clicking same item
* [ ] show all (hidden)
* [ ] hide not selected
* [ ] use spacenavigator
* [ ] set focus to selected with button
  * [ ] set focus on selected when you click on a item 
* [ ] clear scene (so you can load new, else it will add)
* [ ] enable wireframe on material
* [ ] some selection three
* [x] simple clipping tools
  * [x] with working selection/picking to get data about item
* [x] simple ground plane


Issues:
- little bit buggy when using clipping and selecting, temp fix: click invert 2 times after moving slider

## how to use

* clone repo
* npm install
* npm start
* open browser to [localhost](http://localhost)

## build github pages site
* npm run build




