# firstant2gradle
This is a utility that will allow teams competing in the FIRST Robotics Competition to convert their Ant build systems to Gradle.

Gradle is an extendable build system that is becoming industry standard. This conversion tool makes use of an open source project called (GradleRIO)[https://github.com/Open-RIO/GradleRIO], allowing the official WPI libraries to be used directly in a Gradle build system.

## Installing
Make sure that you have (Node.js)[https://nodejs.org/en/] installed. Afterwords, run the following command:
```
sudo npm install -g firstant2gradle     # MACOSX/LINUX
npm install -g firstant2gradle          # WINDOWS
```

## Converting an Ant build to Gradle

### For those who don't know the command line
1) Open your terminal interface (Terminal on Mac and Ubuntu, Command Prompt on Windows). Type "cd ", but do not press enter yet!
2) Open your file browser and browse to the root folder containing your code. There should be a file in the folder called "build.xml".
3) Drag and drop the folder into your terminal interface. The terminal should have filled in the path to the folder.
4) Hit "enter" to execute the command, and move on to "Doing the conversion"
 
### For those who know the command line
Change the directory of your terminal to the root directory of your code (containing "build.xml"). Move on to "Doing the conversion" 

### Doing the conversion
In your terminal interface, execute the following command:
```
firstant2gradle
```
The tool will ask you if the directory contains "build.xml". You can simple type "y" and hit enter to move on. Afterwords, enter the digits of your team number. The tool will now procede to convert your Ant build to Gradle!