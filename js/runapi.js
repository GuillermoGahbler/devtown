var RunApi = Class.create({ //abstract parent class
    corsProxy : "https://cors-anywhere.herokuapp.com/",
    url : "",
    initialize : function(searchTerm) {
        this.searchTerm = searchTerm.replace(/\s+/g, '-').toLowerCase();
    },
    
    processData : function(data){
        console.log("ProcessData function");
        //this function will need to be overwritten by child classes
        //because we would be handling data from different API's differently
        //essentially, this function is a pure virtual function 
    },
    run : function(){
        console.log("run function");
        this.url = this.corsProxy + this.url;
        console.log(this.url);
        new Ajax.Request(this.url, {
            method : 'get',
            onSuccess : this.processData,
            onFailure : function() { console.log("something went wrong");}
        });
        //make an ajax call with this.url and this.searchTerm
    },
    concatURL : function() {
        //concat this.url to this.searchTerm
        //funciton needs to be overwritten
        console.log("concatURL function");
    }
});

var CityScoresAPI = Class.create(RunApi,{
    initialize : function($super,searchTerm){
        $super(searchTerm);
        
        this.url = "https://api.teleport.org/api/urban_areas/slug:"+this.searchTerm+"/scores/";

        this.run();
    },
    processData : function($super, data){
        console.log("Running ProcessData in CityScores API");
        
        var scores = data.responseJSON.categories;
        var obj = {};
        scores.each(function(element){
            obj[element.name] = Math.round(element.score_out_of_10);
        });

        console.log(obj);
        return obj;
    }
});

var SalariesAPI = Class.create(RunApi,{
    initialize : function($super,searchTerm){
        $super(searchTerm);
        this.url = "https://api.teleport.org/api/urban_areas/slug:"+this.searchTerm+"/salaries/";
        this.run();
    },
    processData : function($super, data){
        //$super(data);
        console.log("Running ProcessData in Salaries API");
        
        var salaries = data.responseJSON.salaries;
        console.log(salaries);
        var obj = {};
        //get "web developer" salary
        salaries.each(function(element){
            if(element.job.title === "Web Developer"){
                obj["pct_25"] = Math.round(element.salary_percentiles.percentile_25).toLocaleString();
                obj["pct_50"] = Math.round(element.salary_percentiles.percentile_50).toLocaleString();
                obj["pct_75"] = Math.round(element.salary_percentiles.percentile_75).toLocaleString();
            }
        });

        console.log(obj);
        return obj;
    }
});

var JobsAPI = Class.create(RunApi,{
    initialize : function($super,searchTerm){
        $super(searchTerm);
        this.url = "https://jobs.github.com/positions.json?";
        this.description = "description=web+development" + "&";
        this.searchTerm = "location="+this.searchTerm+"&";
        this.url += this.description + this.searchTerm;

        this.run();
    },
    processData : function(data){
        console.log("Running ProcessData in JobsAPI")
        console.log(data.responseJSON);

        //need to discuss with the team on what data to return from JobsAPI's processData function
    }
});
