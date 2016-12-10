const http      = require("http");
const express   = require("express");
const app       = express();
const fs        = require("fs");
const exec      = require("child_process").exec;
const util      = require("util");  // For util.format().
const bodyParser = require('body-parser');  // for parsing application/json

// Init
app.use(bodyParser.json());

// State
var renderInProcess = false;

// Config
const AE_RENDERER_PATH      = "\"D:\\Program Files\\Adobe\\Adobe After Effects CS6\\Support Files\\aerender.exe\"";
const AE_RENDERER_BASEPATH  = "D:\\Program Files\\Adobe\\Adobe After Effects CS6\\Support Files\\";
const AE_TEMPLATE_PATH      = "D:\\Downloads\\drive-download-20161210T022057Z\\01_Project file\\Creative Montage converted.aep";
const AE_TEMPLATE_BASEPATH  = "D:\\Downloads\\drive-download-20161210T022057Z\\01_Project file\\";
const WEB_ROOT              = "D:\\xampp\\htdocs\\"
const MAX_NUM_IMAGES        = 15;
var RENDER_SETTINGS         = "MP4_Settings";
RENDER_SETTINGS = "MP4_Settings_Lite";
const OUTPUT_MODULE         = "MP4_Custom";

// Sample JSON for debugging
var SAMPLE_JSON = [
    {
        "image_path": "input\\abc.jpg",
        "image_caption": "Caption #1"
    },
    {
        "image_path": "input\\abc.jpg",
        "image_caption": "Caption #2"
    },
    {
        "image_path": "input\\abc.jpg",
        "image_caption": "Caption #3"
    }
];
//var json_string = null;
var parsed_json = null;

app.get('/', function (req, res) {
    res.send('Hello world!');
});

app.post('/generate_video', function(req, res) {
    //res.send('Generating video...\n');
    console.log("Generate video requested.");
    if (req.is('json')) {
        parsed_json = req.body;
        if (generate_video()) {
            res.send('Generate video success.');
        } else {
            res.send('Generate video failed.');
        }
    } else {
        console.log("Invalid JSON.");
        res.send('Invalid JSON.');
    }
});

var server = app.listen(8088, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Vidgen server listening on port %s.", port);

});

function generate_video() {
    if (parsed_json == null) {
        console.log("No json available. Aborting.");
        return;
    }
    if (renderInProcess) {
        console.log("Render already in progress - dropping new request.");
        return false;
    }
    
    renderInProcess = true;
    //var json_string = JSON.stringify(SAMPLE_JSON);  // TEST
    //var parsed_json = JSON.parse(json_string);
    
    for (var i=0; i<parsed_json.length && i<=MAX_NUM_IMAGES; i++) {
        var image_path = WEB_ROOT + parsed_json[i].image_path;
        var image_caption = parsed_json[i].image_caption;
        
        // Copy image to project_folder/assets
        fs.createReadStream(image_path).pipe(fs.createWriteStream(AE_TEMPLATE_BASEPATH + '/assets/image_' + (i+1) + image_path.substr(image_path.lastIndexOf("."))));
        
        // Create data file with caption in AE_RENDERER_BASEPATH/data
        var data = util.format("var dataSource = {caption: \"%s\"}", parsed_json[i].image_caption);
        var file = AE_RENDERER_BASEPATH + '/data/data' + (i+1) + '.js';
        fs.writeFile(file, data, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }
    
    // Start rendering.
    var params = util.format(" -project \"%s\" -comp \"%s\" -output \"%s\" -RStemplate " + RENDER_SETTINGS + " -OMtemplate \"" + OUTPUT_MODULE + "\" -continueOnMissingFootage", AE_TEMPLATE_PATH, "01_Final Comp_1920x1080", WEB_ROOT + "output/output_video.mp4");
    
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
        renderInProcess = false;
        
        // Render finished!
        // Return output file to webserver
        
        http.request({host: 'localhost', path: '/?video=1'}).end();
    });
    return true;
}
// FOR TEST
//parsed_json = SAMPLE_JSON;
//generate_video();