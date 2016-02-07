#! /usr/bin/env node
var colors = require("colors");
var fs = require("fs");
var IsThere = require("is-there");
var globule = require("globule");
var Git = require("nodegit");
var prompt = require("prompt");
var wget = require("wget-improved");
var ProgressBar = require("progress");
var AdmZip = require("adm-zip");
require("shelljs/global");

prompt.start();

var schema = {
    properties: {
        yesno_cordir: {
            message: "Is this terminal in the same directory as build.xml? (y/n)",
            validator: /y[es]*|n[o]?/,
            warning: "Must respond yes or no",
            default: "no",
            required: true
        },
        team_number: {
            message: "What is your team number? (digits only)",
            default: "0000",
            required: true
        }
    }
};

console.log("It is recommended that you back up this directory before continuing on with the conversion!".magenta);

var team_number;

prompt.get(schema, function(err, result) {
    team_number = result.team_number;
    if(result.yesno_cordir.match(/y[es]*/g)) {
        console.log("Creating a backup...".cyan);
        cp("-r", "./.", "../FIRSTANT2GRADLE_BACKUP/");
        
        console.log("Beginning to convert...".green);
        
        rm("-rf", "bin");
        rm("build.properties", "build.xml");
        
        console.log("Downloading GradleRIO, this may take some time...".cyan);
        var download = wget.download("https://github.com/Open-RIO/GradleRIO/releases/download/v3.0.0/GradleRIO.zip",
            "GradleRIO.zip", {});
        download.on('error', function(err) {
            console.log(colors.red(err));
        });
        download.on('progress', function(progress) {});
        download.on('start', function(fileSize) {});
        download.on('end', function(output) {
            console.log("Done!".green);
            
            console.log("Unzipping...".cyan);
            var zip = new AdmZip("GradleRIO.zip");
            zip.extractAllTo(pwd());
            rm("-rf", "__MACOSX");
            console.log("Done!".green);
            rm("GradleRIO.zip");
            
            console.log("Undergoing cleanup...".cyan);
            rm("-rf", "GradleRIO/src");
            mv("GradleRIO/*", pwd());
            rm("-rf", "GradleRIO");
            mv("GradleRIO4Dummies.txt", "GradleRIO_HOWTO.txt");
            
            rm("-rf", ".project", ".classpath", "*.iml", "*.ipr", "*.iws", ".idea");
            
            console.log("Changing sources to Maven-style...".cyan);
            mkdir("main");
            cd("main");
            mkdir("java");
            cd("..");
            mv("src/*", "main/java");
            mv("main", "src");
            
            console.log("Generating an appropriate .gitignore file...".cyan);
            fs.writeFile(".gitignore", "*.class\n" +
            ".project\n" +
            ".DS_Store\n" +
            ".classpath\n" +
            ".texlipse\n" +
            ".springBeans\n" +
            "bin/\n" +
            "gen/\n" +
            "local.properties\n" +
            "*.iml\n" +
            "*.ipr\n" +
            "*.iws\n" +
            ".idea/\n" +
            ".gradletasknamecache\n" +
            ".gradle/\n" +
            "build/\n" +
            "!gralde/wrapper/gradle-wrapper.jar\n" +
            "!gradle/libs/GradleRIO.jar\n" +
            "!libs/*.jar\n", 'utf8', function(err) {
                if(err) return console.log(err);
                
                console.log("Editing build.gradle...".cyan);
                fs.readFile("build.gradle", 'utf8', function (err,data) {
                    if (err) {
                        return console.log(err);
                    }
                    var result = data.replace('0000', team_number).replace('0000', team_number);

                    fs.writeFile("build.gradle", result, 'utf8', function (err) {
                        if (err) return console.log(err);
                        
                        console.log("Done!\n\n".green);
                        
                        console.log("Congrats!!".rainbow);
                        console.log("Your Ant build has been converted into Gradle!\n");
                        
                        console.log("Please take the following steps:".magenta);
                        console.log("1) Edit build.gradle to ensure that everything is in order.");
                        console.log("2) Make sure that gradle/**/*.jar is not in your .gitignore file.");
                        console.log("3) Make sure that your IDE specific project files are deleted (.project & .classpath for Eclipse).");
                        console.log("4) If this conversion has not worked as expected, a backup was made before conversion up one directory in 'FIRSTANT2GRADLE_BACKUP'.");
                    });
                });
            });
        });
    }else{
        console.error("Aborting for safety. Please make sure that this is the same directory as build.xml, run the script again and respond 'yes'.");
    }
});