//Fetching json data from covid19india apis
var xmlhttp = new XMLHttpRequest();
var url = "https://api.covid19india.org/raw_data.json";

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        //Parsing JSON and storing in data array.
        var data = JSON.parse(this.responseText);
        console.log(data.raw_data[2342]);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

//Iske baad dekhte hain :P