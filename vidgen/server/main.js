const http      = require("http");
const express   = require("express");
const app       = express();
const fs        = require("fs");
const exec      = require("child_process").exec;
const util      = require("util");  // For util.format().

// Config
const AE_RENDERER_PATH = "\"D:\\Program Files\\Adobe\\Adobe After Effects CS6\\Support Files\\aerender.exe\"";
const AE_TEMPLATE_PATH = "D:\\Downloads\\drive-download-20161210T022057Z\\01_Project file\\Creative Montage converted.aep";
const AE_TEMPLATE_BASEPATH = "D:\\Downloads\\drive-download-20161210T022057Z\\01_Project file\\";
const MAX_NUM_IMAGES = 15;

// Sample JSON for debugging
var SAMPLE_JSON = [
    {
        "image_path": "D:\\dev\\FO4\\Time\\SS\\20161130033510_1.jpg",
        "image_caption": "Caption #1"
    },
    {
        "image_path": "D:\\dev\\FO4\\Time\\SS\\20161130033510_1.jpg",
        "image_caption": "Caption #2"
    },
    {
        "image_path": "D:\\dev\\FO4\\Time\\SS\\20161130033510_1.jpg",
        "image_caption": "Caption #3"
    }
];

app.get('/', function (req, res) {
    res.send('Hello world!');
});

app.get('/generate_video', function(req, res) {
    res.send('Generate video');
    console.log("Generate video");
    generate_video();
});

var server = app.listen(8088, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Vidgen server listening on port %s.", port);

});

function generate_video() {
    var json_string = JSON.stringify(SAMPLE_JSON);  // TEST
    
    var parsed_json = JSON.parse(json_string);
    for (var i=0; i<parsed_json.length && i<=MAX_NUM_IMAGES; i++) {
        var image_path = parsed_json[i].image_path;
        var image_caption = parsed_json[i].image_caption;
        
        // Copy image to project_folder/assets
        fs.createReadStream(image_path).pipe(fs.createWriteStream(AE_TEMPLATE_BASEPATH + '/assets/image_' + (i+1) + image_path.substr(image_path.lastIndexOf("."))));
        
        // Create data file with caption in project_folder/data
        var data = util.format("var dataSource = {caption: \"%s\"}", parsed_json[i].image_caption);
        var file = AE_TEMPLATE_BASEPATH + '/data/data' + (i+1) + '.js';
        fs.writeFile(file, data, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }
    
    /*
    var params = util.format(" -project \"%s\" -comp \"%s\" -output %s -RStemplate MP4_Settings -OMtemplate \"MP4_Custom\" -continueOnMissingFootage", AE_TEMPLATE_PATH, "01_Final Comp_1920x1080", "output_video.mp4");
    
    //console.log("Executing: " + AE_RENDERER_PATH + params);
    
    var child = exec(AE_RENDERER_PATH + params);
    child.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });
    child.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });
    child.on('close', function(code) {
        console.log('closing code: ' + code);
    });
    */
}

generate_video();