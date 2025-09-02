# Indra.ai README

Indra.ai is a system developed by Quinn A Michaels for the purpose of his Vedic Religious Practice. Everyone in the world likes to steal from Quinn A Michaels then argue about how his technology should be used. Well that's the exact reason that Quinn A Michaels doesn't license his technology to anyone. 

## The Program

The site runs in 2 sections the Node JS CLI and the Jekyll Build for the github page.

### NodeJS

The NodeJS app is started with `npm start` from the main `./` directory. That loads the program that lives in the `./src` directory.

#### Scripts
1. `npm start` - Run the NodeJS application.
2. `npm run serve` - This will run the Jekyll Server to work with the indra.ai website build.
3. `npm run build` - Run the Jekyll Build to generate the latest site without running the server.
4. `npm run buddy` - Launch the Deva Buddy for building new Devas.
5. `npm run webcss` - Build the css for the website portion of the app.
6. `npm run uicss` - Build the css for the indra.ai user interface.
7. `npm run test` - Run the Indra.ai unit tests.

### Jekyll

1. `./_data` - The data directory where the site data is published in JSON format.
2. `./_includes` - The include files for various code blocks like headers and footers.
3. `./_layouts` - The different layout files for the website display.
4. `./_posts` - The posts for the site written in Markdown format.
5. `./_site` - The directory where the site build is placed that is the resulting output.
6. `./algorithms` - The resulting output content files for the indra.ai algorithms.

## The Source 
`./src`

### ./src/buddy

### ./src/data

### ./src/devas

### ./src/func

### ./src/methods

### ./src/styl

### ./src/ui