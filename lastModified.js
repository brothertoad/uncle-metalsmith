// A plugin to add a lastModified property to each page,
// based on the mtime in the stat.

module.exports = plugin;

// Lookup table for month names.  This is 0-based.
var monthName = [ 'January',
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

function plugin(options){
    return function(files, metalsmith, done) {
        setImmediate(done);
        Object.keys(files).forEach(function(file) {
            let data = files[file];
            let mtime = data.stats.mtime;
            data.lastModified = monthName[mtime.getMonth()] + ' ' + mtime.getDate() + ', ' + mtime.getFullYear();
        });
    }
}
