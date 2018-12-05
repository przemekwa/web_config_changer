console.log('Web.config changer ');
var program = require('commander');

program
    .option('-c, --country <aaa>', 'Country')
    .parse(process.argv);

if (!program.country) {
    console.log('No county set ');  
    return;
} 

var fs = require('fs'),
    parseString = require('xml2js').parseString,
    xml2js = require('xml2js');

    const  pathToWebConfig = 'D:\\Projects\\Selgros\\PG\\trunk\\SelgrosPG.Presentation\\web.config';
    const  pathToAppConfig = 'D:\\Projects\\Selgros\\PG\\trunk\\SelgrosPG.TranslationsConverter\\SelgrosPGTranslationsConverter\\App.config';

fs.readFile(pathToWebConfig, 'utf-8', function (err, data) {
    if (err) console.log(err);

    parseString(data, function (err, result) {
        if (err) console.log(err);
        var json = result;

        for (var i = 0; i < json.configuration.appSettings[0].add.length; i++) {
            var key = json.configuration.appSettings[0].add[i].$.key;
            if (key == 'Country') 
                json.configuration.appSettings[0].add[i].$.value = program.country;
        }

        var regex = /Data Source=.\\[\w_]*;/g

        for (var j = 0; j < json.configuration.connectionStrings[0].add.length; j++) {
            var old = json.configuration.connectionStrings[0].add[j].$.connectionString;
            if (program.country == "PL") {
                var new1 = old.replace(regex, 'Data Source=.\\SQLEXPRESS;')
            }
            else {
                var new1 = old.replace(regex, 'Data Source=.\\SQLEXPRESS_' + program.country + ';')
            }
            json.configuration.connectionStrings[0].add[j].$.connectionString = new1;
        }

        var builder = new xml2js.Builder({ cdata: true });
        var xml = builder.buildObject(json);

        fs.writeFile(pathToWebConfig, xml, function (err, data) {
            if (err) console.log(err);
            console.log("successfully written our update to web.config");
        })
    });
});       


fs.readFile(pathToAppConfig, 'utf-8', function (err, data) {
    if (err) console.log(err);

    parseString(data, function (err, result) {
        if (err) console.log(err);
        var json = result;

        for (var j = 0; j < json.configuration.appSettings[0].add.length; j++) {
            var key = json.configuration.appSettings[0].add[j].$.key;
          
            if (key == 'DatabaseServer') {

                if (program.country == "PL") {
                    var value = ".\\SQLEXPRESS";
                }
                else
                {
                    var value = '.\\SQLEXPRESS_'+program.country
                }

                json.configuration.appSettings[0].add[j].$.value =value;
            }
        }

        var builder = new xml2js.Builder({ cdata: true });
        var xml = builder.buildObject(json);

        fs.writeFile(pathToAppConfig, xml, function (err, data) {
            if (err) console.log(err);
            console.log("successfully written our update to App.config");
        })
    });
});  