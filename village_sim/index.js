function drawGraph(game){
    var chart = new CanvasJS.Chart("graph", {
	    animationEnabled: true,
	    theme: "light2",
	    title:{
		    text: "Population Vs Time"
	    },
	    axisX:{
            minimum: 0,
		    title: "Time"
	    },
	    axisY:{
		    title: "Population"
	    },
	    data: [{        
		    type: "line",       
		    dataPoints: game.grapher
	    }]
    });
    chart.render();
}

function BuildInfo(){
    this.foodCost = 0;
    this.woodCost = 0;
    this.stoneCost = 0;
    this.buildCost = 0;
    this.housing = 0;
    this.lumber = 0;
    this.costs = [this.foodCost,this.woodCost,this.stoneCost,this.buildCost];
    this.benefits = [this.housing,this.lumber];
}

function JobInfo(){
    this.requireBuild = null;
    this.resource = null;
    this.factor = 1;
}

function Person(){
    this.id = pid;
    this.father = null;
    this.mother = null;
    this.family = null;
    this.age = 0;
    this.sex = 0;
    this.taken = 0;
    this.first = "";
    this.last = "";

    pid++;
}

function Person1(){
    this.id = pid;
    this.father = null;
    this.mother = null;
    this.family = null;
    this.age = 0;
    this.sex = 0;
    this.taken = 0;
    this.first = "";
    this.last = "";
    this.Assign_Name = Assign_Name;
    this.Assign_Sex = Assign_Sex;

    pid++;

    function Assign_Name(){
        if(this.sex==1){
            var firsts = maleNames
        }
        else{
            var firsts = femaleNames
        }
        this.first = firsts[Math.floor(Math.random()*firsts.length)].toLowerCase();
        this.first = this.first.charAt(0).toUpperCase() + this.first.slice(1);
        if(this.father==null){
            this.last = lastNames[Math.floor(Math.random()*lastNames.length)].toLowerCase();
        }
        else{
            this.last = this.father.last;
        }
        this.last = this.last.charAt(0).toUpperCase() + this.last.slice(1);
    }
    function Assign_Sex(){
        var sex = Math.floor(Math.random() * 2);
        this.sex = sex;
    }
}

function Assign_First(sex){
    if(sex==1){
        var firsts = maleNames
    }
    else{
        var firsts = femaleNames
    }
    var first = firsts[Math.floor(Math.random()*firsts.length)].toLowerCase();
    first = first.charAt(0).toUpperCase() + first.slice(1);

    return first;
}

function Assign_Last(){
    last = lastNames[Math.floor(Math.random()*lastNames.length)].toLowerCase();
    last = last.charAt(0).toUpperCase() + last.slice(1);
    return last;
}
function Assign_Sex(){
    var sex = Math.floor(Math.random() * 2);
    return sex;
}

function Family(partner1,partner2){
    partner1.taken = 1;
    partner1.family = this;
    partner2.taken = 1;
    partner2.family = this;
    this.offspring = 0;
    this.dead = 0;
    if (partner1.sex==1){
        this.male=partner1;
        this.female=partner2;
    }
    else{
        this.male=partner2;
        this.female=partner1;
    }
}

function Family1(partner1,partner2){
    partner1.taken = 1;
    partner1.family = this;
    partner2.taken = 1;
    partner2.family = this;
    this.offspring = [];
    this.dead = 0;
    if (partner1.sex==1){
        this.male=partner1;
        this.female=partner2;
    }
    else{
        this.male=partner2;
        this.female=partner1;
    }
}

function Create_Initial_Families(){

    //HARD CODED
    var couples = 5;
    var singles = 10;
    var population = [];
    var families = [];

    //Make family units
    for(var i=0;i<couples;i++){

        //Determine how many children will be in each family
        children = Math.floor(Math.random() * (4));

        //Make Mommy
        var mother = new Person();
        mother.age = Math.floor(Math.random() * (40 - 22) + 22);
        mother.taken = 1;
        mother.first = Assign_First(0);
        mother.last = Assign_Last();
        population.push(mother);

        //Make Daddy
        var father = new Person();
        father.age = Math.floor(Math.random() * (40 - 22) + 22);
        father.taken = 1;
        father.sex = 1;
        father.first = Assign_First(0);
        father.last = Assign_Last();
        population.push(father);

        //Make family
        var family = new Family(mother,father);

        //Make children
        for(var j=0;j<children;j++){
            var child = new Person();
            child.age = Math.floor(Math.random() * 18);
            child.sex = Assign_Sex();
            child.mother = mother;
            child.father = father;
            child.first = Assign_First(child.sex);
            child.last = father.last;
            population.push(child);
            family.offspring++;
        }
        families.push(family);
    }

    //Make singles
    for(var i=0;i<singles;i++){
        var single = new Person();
        single.age = Math.floor(Math.random() * (40 - 18) + 18);
        single.sex = Assign_Sex();
        single.first = Assign_First(single.sex);
        single.last = father.last = Assign_Last();;
        population.push(single);
    }
    return [population,families];
}


function Disp_Pops(population){
    var popDiv = document.getElementById("pop")
    popDiv.removeChild(popDiv.children[0]);
    var p = document.createElement("P");
    var head = "Population: "+population.length;
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createTextNode(head));
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createTextNode("Workers: "+Get_Workers(population)));
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createElement("br"));
    for(var i=0;i<population.length;i++){
        var person = population[i];
        var text = (person.first+" "+person.last+": "+person.age);
        p.appendChild(document.createTextNode(text));
        p.appendChild(document.createElement("br"));
    }
    p.style.margin = "0px 5px";
    popDiv.appendChild(p);
}

function dashes(){
    var dashes = ""
    for(var i=0;i<100;i++){dashes+='-';}
    return dashes;
}

function All_Procreate(population, families, housing){
    
    for(var i=0;i<families.length;i++){
        var family = families[i];
        var popMod = ((population.length-(main.time.length+30))/(main.time.length+30));
        var chance = (.75/(family.offspring+1))/Math.pow((1+popMod),1);
        //var chance = (.75/(family.offspring+1))

        //Establishes that the partners are in reproduction age range, both are alive, and there is housing to support more children in the village
        if (family.male.age<45 && family.female.age<45 && Math.random()<=chance && family.dead==0){

            //Make babby
            offspring = new Person();
            offspring.sex = Assign_Sex();
            offspring.father = family.male;
            offspring.mother = family.female;
            offspring.first = Assign_First(offspring.sex);
            offspring.last = offspring.father.last;
            family.offspring++;
            population.push(offspring);
            //Log(family.male.first+" "+family.male.last+" and "+family.female.first+" "+family.female.last+" have had a baby, "+offspring.first+"!");
        }
    }
}

function Find_Matches(population, families){
    //Fills a list with only the part of the population that are eligible for pairing 
    var eligiblePop = [];
    for(var i=0;i<population.length;i++){
        if(population[i].age>=18 && population[i].age<=45 && !population[i].taken){
            eligiblePop.push(population[i]);
        }
    }

    //Bear with me here
    //While loops are necessary because sometimes we don't increment
    //Attempts to match every eligible person each year based on chance
    var i = 0;
    while(i<eligiblePop.length){
        var person1 = eligiblePop[i];

        //Boolean used to establish whether to increment or not (we'll get to that later)
        var matched = 0;

        //Attempts to find a suitable partner
        var j = 0;
        while(j<eligiblePop.length){
            var person2 = eligiblePop[j];

            //These 2 ifs get a suitible partner if one exists
            if(person1.sex!=person2.sex){
                if (person1.father==null || person2.father==null || person1.father.id!=person2.father.id){

                    //Chance is low the first year a person looks for a partner, increases with age
                    if(Math.random()>Math.pow(.75/(person1.age-17),.3)){
                        
                        //Match if person passes chance test
                        Match(person1,person2,families);
                        matched = 1;

                        //Because index order is not important as long as the people left are still ahead 
                        //and the people completed are behind, the quickest way to rid the 2 (now ineligible) 
                        //people are to assign the last 2 people of the list to them and remove the duplicates at the end.
                        eligiblePop[i] = eligiblePop[eligiblePop.length-1];
                        eligiblePop[j] = eligiblePop[eligiblePop.length-2];
                        eligiblePop.splice(-2,2);

                        //The match is complete for these 2 people, and we will move on to the next.
                        break;
                    }

                    //The person failed the chance test and they will not find a partner this year.
                    break;
                }
            }

            //If we reach this point, a suitable person has not been found for person 1 
            //(all thusfar have been the same sex or sibling) and therefore we move on to the next 
            j++;
        }

        //If the person has found a match, the indices have been overwritten with new people, and so we must match them as well.
        //Otherwise, the person has not found a match, stays in their index, and we must move on and increment the index.
        if(!matched){
            i++;
        }
    }
}

function Find_Matches1(population, families){
    var eligiblePop = [];
    for(var i=0;i<population.length;i++){
        if(population[i].age>=18 && population[i].age<=45 && !population[i].taken){
            eligiblePop.push(population[i]);
        }
    }
    for(var i=0;i<eligiblePop.length;i++){
        var person1 = eligiblePop[i];
        if(!person1.taken){
            for(var j=0;j<eligiblePop.length;j++){
                var person2 = eligiblePop[j];
                if(person1.sex!=person2.sex && !person2.taken){
                    if (person1.father==null || person2.father==null || person1.father.id!=person2.father.id){
                        if(Math.random()>Math.pow(.75/(person1.age-17),.3)){                            
                            Match(person1,person2,families);
                            break;
                        }
                        break;
                    }
                }
            }
        }
    }
}

function Match(person1,person2,families){
    var newFamily = new Family(person1,person2);
    //console.log(person1.first+" "+person1.last+" and "+person2.first+" "+person2.last+" have wed at the ages of "+person1.age+" and "+person2.age+"!");
    families.push(newFamily);
}

function Sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function Show_Tab(rightMenu,btnIdx){
    if(rightMenu){
        btns = document.getElementById("rightInfo").children;
        menuBtns = document.getElementById("rightMenu").children;
    }
    else{
        btns = document.getElementById("leftInfo").children;
        menuBtns = document.getElementById("leftMenu").children;
    }
    for(var i=0;i<btns.length;i++){
        if(i==btnIdx){
            btns[i].style.display="flex";
            menuBtns[i].style.borderBottom = "0";
        }
        else{
            btns[i].style.display="none";
            menuBtns[i].style.borderBottom = "2px solid black";
        }
    }
}

function Increment_Worker(game,job,toAdd,reps){
    for(var i=0;i<reps;i++){
        if((toAdd&&Check_Add_Worker(game,job)||(!toAdd&&Check_Subtract_Worker(game,job)))){
            if(toAdd){
                var increment = 1;
            }
            else{
                var increment = -1;
            }
            if(job==1){
                game.flow[0] += increment;
            }
            var reqIdx = game.jobInfo[job].requireBuild;
            if(reqIdx!=null){
                game.flow[reqIdx] -= increment;                    
            }
            game.jobs[job] += increment;
            game.flow[1] -= increment;
            Update_Resources(game,0);
            Update_Info(job,game);
        }
    }
}

function Check_Add_Worker(game,job){
    if(game.flow[1]>0){
        if(game.jobInfo[job].requireBuild==null){
            return true;
        }
        else if(game.flow[game.jobInfo[job].requireBuild]>0){
            return true;
        }
    }
    return false;
}   

function Check_Subtract_Worker(game,job){
    if(game.jobs[job]>0){
        if(job!=1||game.flow[0]>0){
            return true;
        }
    }
    return false;
}

function Increment_Build(game,build,toAdd,reps){
    for(var i=0;i<reps;i++){
        if((toAdd&&Check_Add_Building(game,build)||(!toAdd&&Check_Subtract_Building(game,build)))){
            if(toAdd){
                var increment = 1;
            }
            else{
                var increment = -1;
            }
            game.buildPlan[build] += increment;
            game.resources[1] -= increment*(game.buildInfo[build].woodCost);
            game.resources[2] -= increment*(game.buildInfo[build].stoneCost);
            game.flow[0] -= increment*(game.buildInfo[build].buildCost);
            game.resources[3] += increment*(game.buildInfo[build].housing);
            game.flow[2] += increment*(game.buildInfo[build].lumber);
            Update_Resources(game,1);
            Update_Resources(game,0);
            Update_Buildings(build,game);
        }
    }
}

function Check_Add_Building(game,build){
    if(game.resources[1]>=game.buildInfo[build].woodCost){
        if(game.resources[2]>=game.buildInfo[build].stoneCost){
            if(game.flow[0]>=game.buildInfo[build].buildCost){
                return true;
            }
        }
    }
    return false;
}

function Check_Subtract_Building(game,build){
    if(game.buildPlan[build]>0){
        if(game.resources[3]>=game.buildInfo[build].housing){
            if(game.flow[2]>=game.buildInfo[build].lumber){
                return true;
            }
        }
    }
    return false;
}

function Update_Info(job,game){
    var role = document.getElementById("roles").children[job];
    role.removeChild(role.children[0]);   
    var spn = document.createElement("span"); 
    spn.style.cursor = "help";
    switch(job){
        case 0:
            var t = ("Farmers: ");
            spn.title = "Farmers yield 2 food.";
            break;
        case 1:
            var t = ("Builders: ");
            spn.title = "Builders yield 1 build per year.";
            break;
        case 2:
            var t = ("Woodcutters: ");
            spn.title = "Woodcutters yield 1 wood.  1 lumber point necessary.";
            break;
    }
    t += game.jobs[job];
    spn.appendChild(document.createTextNode(t))
    role.appendChild(spn);
}

function Update_Buildings(build,game){
    var building = document.getElementById("buildings").children[build];
    building.removeChild(building.children[0]);
    var spn = document.createElement("span");
    spn.style.cursor = "help";
    switch(build){
        case 0:
            var t = ("Huts: "+ game.buildPlan[0]);
            spn.title = "Provide 2 housing.\nCost: 1 builder and 1 wood"
            break;
        case 1:
            var t = ("Lumber Mills: "+ game.buildPlan[1]);
            spn.title = "Provide 1 lumber point.\nCost: 1 builder and 1 wood"
            break;
    }
    spn.appendChild(document.createTextNode(t));
    building.appendChild(spn);
}

function Update_Resources(game,pit){
    if(pit){
        var resources = document.getElementById("resources").children;
    }
    else{
        var resources = document.getElementById("flow").children;
    }
    for(var i=0;i<resources.length;i++){
        resource = resources[i];
        resource.removeChild(resource.children[1]);
        var spn = document.createElement("span");
        if(pit){
            var t = game.resources[i];
        }
        else{
            var t = game.flow[i];
        }
        spn.appendChild(document.createTextNode(t));
        resources[i].appendChild(spn);
    }
}

function Get_Workers(population){
    var workers = 0;
    for(var i=0;i<population.length;i++){
        if(population[i].age<65 && population[i].age>=15){
            workers ++;
        }
    }
    return workers;
}

function Clear_Build_Plans(game){
    for(var i=0;i<game.buildPlan.length;i++){
        game.totalBuild[i] += game.buildPlan[i];
        game.buildPlan[i] = 0;
        Update_Buildings(i,game)
    }
    game.flow[0] = game.jobs[1];
}

function Delete_Employees(game){
    var i = 0;
    var prevCount = 0;
    while(game.flow[1]<0){
        Increment_Worker(game,i,0,1);
        if(game.jobs[i]==prevCount){
            i++;
            prevCount = 0;
        }
        else{
            prevCount = game.jobs[i];            
        }
    }
}

function Init_New_Turn(game){
    game.flow[1] = Get_Workers(game.p)-game.jobs.reduce((a, b) => a + b, 0);
    Delete_Employees(game)
    Update_Resources(game,1);
    Update_Resources(game,0);
    for(var i=0;i<game.jobs.length;i++){
        Update_Info(i,game);        
    }
}

function Graph(game){
    game.time.push(game.time.length);
    game.pt.push(game.p.length);
    game.grapher.push({x:game.time[game.time.length-1], y:game.pt[game.time.length-1]});
    //drawGraph(game);
}

function Increment_Age(p){
    for(var i=0;i<p.length;i++){
        p[i].age ++;
    }
}

function Log(str){
    var log = document.getElementById("log");
    var spn = document.createElement("span");
    spn.style.margin = "0px 5px";
    spn.appendChild(document.createTextNode(str));
    log.appendChild(spn);
}

function Increment_Year(game){
    var population = game.p;
    var families = game.families

    //Log(dashes());
    //Log("Year "+game.time.length);
    //Log(dashes());

    //Pushes build plans to total buildings and clears the vector
    //Clear_Build_Plans(game);

    //Increments the population's age by 1
    //console.log("Incrementing Age");
    Increment_Age(population);
    
    //Accrue and expend resources
    //RESOURCES(game);

    //Population lives if they have a home, otherwise they succumb to the elements of the winter
    //LIVE(game);

    //Some may die from old age
    //console.log("KILL");
    OLD(game);

    //Reset counters on workers and builders, remove impossible employees if employed exceeds total worker count, reset resource counts
    //Init_New_Turn(game);

    //Create new children based on certain conditions
    //console.log("PROCREATE");
    All_Procreate(population, families, game.resources[3]);

    //Couples wed if conditions are met
    //console.log("MATCH");
    Find_Matches(population, families);

    //Updates population tab
    //Disp_Pops(population);

    //Updates graph
    //console.log("Autisting")
    Graph(game);

    //Save game
    //Save(game);
}

function Save(game){
    localStorage.setItem("game", JSON.stringify(game));
}

/*function Purge_Save(game){
    localStorage.setItem("game", null);
    location.reload();
}*/

function LIVE(game){
    while(game.p.length>game.resources[3]){
        var dead = Math.floor(Math.random()*game.p.length);
        KILL(game.p,dead,1);
    }
}

function RESOURCES(game){
    for(var i=0;i<game.jobs.length;i++){
        var job = game.jobInfo[i]
        if(job.resource!=null){
            game.resources[job.resource] += job.factor*game.jobs[i];            
        }
    }

    //population eats food throughout year or starves
    EAT(game);
}

function EAT(game){
    var food = game.resources[0];

    //Every person in village eats 1 food per year
    food -= game.p.length;

    //Starve the difference between the population and the amount of food
    while(food<0){
        var dead = Math.floor(Math.random()*game.p.length);
        KILL(game.p,dead,0);
        food++;
    }
    game.resources[0] = food;
    Update_Resources(game,1);
}

function OLD(game){
    var i = 0;
    while(i<game.p.length){
        if (Math.random()>(1-(Math.pow(game.p[i].age,4)/400000000))){
            KILL(game.p,i,2);
        }
        else{
            i++;
        }
    }
}

function KILL(population,idx,type){
    var person = population[idx]
    /*var deathStr = (person.first+" "+person.last+" has died at "+person.age);
    switch(type){
        case 0:
            deathStr += " from starvation!"
            break;
        case 1:
            deathStr += " from a cold winter and no home!"
            break;
        case 2:
            deathStr += " from natural causes."
            break;
    }*/
    //console.log(deathStr);
    if (person.family!=null){
        person.family.dead = 1;
    }
    population[idx] = population[population.length-1];
    population.pop();
}

function Main(){
    //Create initial pops
    var peopleStructs = Create_Initial_Families();

    //Set attributes
    this.time = [0];
    this.p = peopleStructs[0];
    this.pt = [this.p.length];
    this.families = peopleStructs[1];
    this.grapher = [{x:this.time[0], y:this.pt[0]}];
    this.resources = [0,0,0,0];
    //this.flow = [0,0,0];
    //this.jobs = [0,0,0];
    //this.totalBuild = [0,0];
    //this.buildPlan = [0,0];

    //Create information regarding buildings for:

    //Huts
    /*var hutInfo = new BuildInfo();
    hutInfo.woodCost = 1;
    hutInfo.buildCost = 1;
    hutInfo.housing = 2;

    //Lumber mills
    var lumMillInfo = new BuildInfo();
    lumMillInfo.woodCost = 1;
    lumMillInfo.buildCost = 1;
    lumMillInfo.lumber = 1;

    this.buildInfo = [hutInfo,lumMillInfo];

    //Create information regarding jobs for:

    //Farmers
    var farmInfo = new JobInfo();
    farmInfo.resource = 0;
    farmInfo.factor = 2;

    //Builders
    var builderInfo = new JobInfo();

    //Woodcutters
    var woodCutInfo = new JobInfo();
    woodCutInfo.requireBuild = 2;
    woodCutInfo.resource = 1;

    this.jobInfo = [farmInfo,builderInfo,woodCutInfo];*/
}
window.onload = function () {
    var loadTime = window.performance.timing.domContentLoadedEventEnd-window.performance.timing.navigationStart; 
    console.log('Simulation time was '+ loadTime/1000 + ' seconds.');
}
const JSON = CircularJSON;
var pid = 0;
var main = new Main();
//Initialize(main,1);
var startPop = main.p.length;
var i = 0;
while(main.time.length<200&&main.p.length<1000000){
    if((i+1)%20==0){
        console.log("Year %i",i+1);  
    }
    //console.log("size of game: "+JSON.stringify(main).length);
    Increment_Year(main);
    i++;
}
//Disp_Pops(main.p);
//console.log("Drawing");
drawGraph(main);
console.log("Starting Population: %i",startPop)
var popString = main.p.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
console.log("Ending Population: %s",popString);
Random_Dude(main);
console.log("The family with the most kids had "+Max_Fam(main)+" kids.");
console.log("The family average for kids was "+Avg_Fam(main)+" kids.");

function Avg_Fam(game){
    var totalKids = 0;
    for(var i=0;i<game.families.length;i++){
        var fam = game.families[i];
        totalKids += fam.offspring;
    }
    var avg = totalKids/game.families.length;
    return avg;
}

function Max_Fam(game){
    var maxFam = 0;
    for(var i=0;i<game.families.length;i++){
        var fam = game.families[i];
        if(fam.offspring>maxFam){
            maxFam = fam.offspring;
        }
    }
    return maxFam;
}

function Random_Dude(game){
    var dude = game.p[Math.round(game.p.length*Math.random())];
    var str = "she";
    var str1 = "her";
    var strCap = "She";
    var str1Cap = "Her";
    if(dude.sex){
        str = "he";  
        str1 = "his";
        strCap = "He";
        str1Cap = "His";
    }
    var fam = (strCap+" didn't start a family with anyone by the end of the simulation, but "+str1+" dad was "+dude.father.first+" "+dude.father.last+" and "+str1+" mom was "+
    dude.mother.first+" "+dude.mother.last+".  "+str1Cap+" siblings were ");
    if(dude.family!=null){
        fam = (str1Cap+" spouse was ");
        if(dude.sex){
            fam += dude.family.female.first+" "+dude.family.female.last;
        }
        else{
            fam += dude.family.male.first+" "+dude.family.male.last;
        }
        var offspring = Find_Offspring(dude,game.p);        
        if(offspring.length>0){
            fam += " and their kids were "
            var kids = ""
            for(var i=0;i<offspring.length;i++){
                if(i!=offspring.length-1){
                    var kid = offspring[i];
                    if(offspring.length!=2){
                        kids += kid.first+" "+kid.last+", ";
                    }
                    else{
                        kids += kid.first+" "+kid.last+" ";
                    }
                }
                else{
                    var kid = offspring[i];
                    kids += "and "+kid.first+" "+kid.last;
                }
            }
            fam += kids;
        }
        fam += (".  "+str1Cap+" dad was "+dude.father.first+" "+dude.father.last+" and "+str1+" mom was "+
        dude.mother.first+" "+dude.mother.last+".  "+str1Cap+" siblings were ");
    }
    var famAdd = "";
    var sibs = Find_Siblings(dude,game.p);
    for(var i=0;i<sibs.length;i++){
        if(i!=sibs.length-1){
            var sib = sibs[i];
            if(sibs.length!=2){
                famAdd += sib.first+" "+sib.last+", ";
            }
            else{
                famAdd += sib.first+" "+sib.last+" ";
            }
        }
        else{
            var sib = sibs[i];
            famAdd += "and "+sib.first+" "+sib.last+".";
        }
    }
    fam += famAdd
    var output = "Our random pop of this simulation was "+dude.first+" "+dude.last+".  "+strCap+" was "+dude.age+" years old when the sim ended.  "
    output += fam;
    console.log(output);
}

function Find_Offspring(parent,population){
    var off = [];
    for(var i=0;i<population.length;i++){
        if(population[i].father.id==parent.id||population[i].mother.id==parent.id){
            off.push(population[i]);
        }
    }
    return off;
}

function Find_Siblings(person,population){
    var sibs = [];
    for(var i=0;i<population.length;i++){
        if(population[i].father.id==person.father.id){
            sibs.push(population[i]);
        }
    }
    return sibs;
}

function Initialize(game,isNew){
    if(isNew){
        game.flow[1] = Get_Workers(game.p);

        //HARD CODED
        game.resources[0] = 20;
        game.resources[1] = 20;
    }
    /*for(var i=0;i<game.jobs.length;i++){
        Update_Info(i,game);
    }
    for(var i=0;i<game.buildPlan.length;i++){
        Update_Buildings(i,game);        
    }*/
    //Update_Resources(game,1);
    //Update_Resources(game,0);
    //Disp_Pops(game.p);
    //drawGraph(game);
}
