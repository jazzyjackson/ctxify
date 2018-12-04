// it should ...
// Embed links in the figjam canonically: if your fig says './resource' thats the href the web browser will have to deal with

// it will be relative to current location, 
// so the fig will load the correct resources
// as long as the cwd clientside (the url pathname)
// is the directory the fig exists in. 
// If you're pulling in a specified full path,
// then you're going to get references to resources 
// that are local to that file.
// so in the future there may be a 'src'/'link'/'href'
// regex that renderes full path links to actual file locations, including remote.
// it would be a huge leap for the newbie sysadmin if they don't have to 
// deal with the headache of 'why does this embedded image work here but not here...' . vs .. vs /
