/*
    @author Joe Williams
    Software Engineering 2: East Carolina University
    IBX Paint: Ordering Sysyem
    error.js - handles errors.
*/

function fatal(err) {
  console.log("Fatal ", err);
  process.exit(1);
}