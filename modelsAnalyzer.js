// A plugin to analyze the files under the models directory.
// It adds metadata to each model page, based on the kit used.
// It also adds an array of builds to the build page.

module.exports = plugin;

function plugin(options){
    return function(files, metalsmith, done) {
        setImmediate(done);
        let kits = metalsmith.metadata().kits;
        let builds = [];
        let buildsData = null;
        Object.keys(files).forEach(function(file) {
            var data = files[file];
            if (file === "builds.njk") {
              buildsData = data;  // save this so we don't have to search again
            }
            data.path = file;
            if (file.startsWith("models/")) {
              let kit = kits[data.kit];
              let build = createBuild(file, data, kit);
              builds.push(build);
              data.title = build.pageTitle;
              data.boxartUrl = build.boxartUrl;
              data.scalematesUrl = build.scalematesUrl;
              data.completionDate = build.completionDate;
            }
        });
        // Sort by key.
        builds.sort(compareBuilds);
        // Add the builds array to the builds.njk file.
        if (buildsData != null) {
          buildsData.builds = builds;
        }
    }
}

function compareBuilds(b1, b2) {
  if (b2.key > b1.key) return 1;
  if (b2.key < b1.key) return -1;
  return 0;
}

// Lookup table for month names.  This is 1-based.
var monthName = [ '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December' ];

// Need to add boxart and scalemates links.
function createBuild(file, data, kit) {
  let build = {};
  let tokens = file.split("/");
  let year = tokens[1]; // Note that this is a string
  let serial = tokens[2].slice(0, 4);
  let month = serial.slice(0,2);
  let iMonth = parseInt(month); // month as number, 1-based
  build.key = parseInt(year + serial);
  build.date = month + "/" + year;
  build.completionDate = monthName[iMonth] + ' ' + year;
  build.brand = kit.brand;
  if (kit.scale === "") {
    build.scale = "N/A";
  }
  else {
    build.scale = kit.scale;
  }
  build.name = kit.name;
  build.number = kit.number;
  build.description = kit.brand + " " + kit.scale + " " + kit.name + " " + kit.number;
  build.pageTitle = kit.brand + " " + kit.scale + " " + kit.name + " (" + kit.number + ")";
  if (data.draft !== true) {
    build.url = "/models/" + year + "/" + serial + "/";
  }
  if (kit.boxart && kit.boxart !== 'None') {
    build.boxartUrl = "https://d1dems3vhrlf9r.cloudfront.net/boxart/" + kit.boxart;
  }
  if (kit.scalematesId) {
    build.scalematesUrl = "http://www.scalemates.com/kits/" + kit.scalematesId;
  }
  return build;
}
