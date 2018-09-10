function BuildInfo(){
    this.foodCost = 0;          //The cost of the building in food
    this.woodCost = 0;          //The cost of the building in wood
    this.stoneCost = 0;         //The cost of the building in stone
    this.buildCost = 1;         //The cost of the building in builders
    this.landCost = 1;          //The cost of the building in land
    this.housing = 0;           //The housing provided
    this.lumber = 0;            //The lumber points provided
    this.farming = 0;           //The farming points provided
    this.stonePoint = 0;        //The stone points provided
    this.millPoint = 0;         //The milling points provided
}

function JobInfo(){
    this.requireBuild = null;   //The index of the required building points for an additional employee
    this.resource = null;       //The index of the resource that gets incremented when there is an employee
    this.factor = 1;            //The multiplier of the resource per employee when accrued
    this.modFactorIdx = null;   //The index of the resource who's factor is modified by having an employee
    this.modFactor = 1;         //The amount added to the factor of the modified resource
}

function Person(){
    this.id = pid;              //The unique id of each person ever created
    this.father = null;         //The person object referring to this person's father
    this.mother = null;         //The person object referring to this person's mother
    this.family = null;         //The family object referring to this person't spouse and number of offspring
    this.age = 0;               //The age of the person in years
    this.sex = 0;               //The sex of the person, 1 for male, 0 for female
    this.taken = 0;             //The boolean referring to whether or not the person has a spouse
    this.first = "";            //The first name of the person
    this.last = "";             //The last name of the person

    pid++;
}

function Family(partner1,partner2){
    partner1.taken = 1;         //Sets the person object as taken, taking them out of the pool to be matched
    partner1.family = this;     //Assigns the person to this family
    partner2.taken = 1;
    partner2.family = this;
    this.offspring = 0;         //The amount of children created by this family
    this.dead = 0;              //Whether this family has a deceased member, making it impossible to have kids
    if (partner1.sex==1){
        this.male=partner1;
        this.female=partner2;
    }
    else{
        this.male=partner2;
        this.female=partner1;
    }
}

function Assign_First(sex){
    if(sex==1){
        var firsts = maleNames
    }
    else{
        var firsts = femaleNames
    }

    //Gets a random entry from the proper first name list, and sets it to lower case
    var first = firsts[Math.floor(Math.random()*firsts.length)].toLowerCase();

    //Capitalizes first letter
    first = first.charAt(0).toUpperCase() + first.slice(1);

    return first;
}

function Assign_Last(){

    //Gets a random entry from the proper first name list, and sets it to lower case
    last = lastNames[Math.floor(Math.random()*lastNames.length)].toLowerCase();

    //Capitalizes first letter
    last = last.charAt(0).toUpperCase() + last.slice(1);
    return last;
}

function Assign_Sex(){

    //Gets random sex
    var sex = Math.floor(Math.random() * 2);
    return sex;
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
        mother.first = Assign_First(mother.sex);
        mother.last = Assign_Last();
        population.push(mother);

        //Make Daddy
        var father = new Person();
        father.age = Math.floor(Math.random() * (40 - 22) + 22);
        father.taken = 1;
        father.sex = 1;
        father.first = Assign_First(father.sex);
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

    //Sorts population list by age
    population.sort(function(a, b) {
        return a.age - b.age;
    })

    //Finds population tab and removes current contents
    var popDiv = document.getElementById("pop");
    popDiv.removeChild(popDiv.children[0]);
    container = document.createElement("DIV");

    //Adds header of population tab to empty container
    var p = document.createElement("P");
    var head = "Population: "+population.length;
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createTextNode(head));
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createTextNode("Workers: "+Get_Workers(population)));
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createElement("br"));
    p.style.margin = "0px 5px";
    container.appendChild(p);

    //Make containers for population
    var subConts = document.createElement("DIV");
    subConts.style = "display:flex;flex-direction:row";
    for(var i=0;i<3;i++){
        var subCont = document.createElement("DIV");
        subCont.style.margin = "0px 5px";
        subCont.style.flexShrink = "0";
        subConts.appendChild(subCont);
    }

    //Adds population to paragraph
    for(var i=0;i<population.length;i++){
        var person = population[i];
        var text = (person.first+" "+person.last+": "+person.age);

        //Adds population across rather than down, avoids many containers
        subConts.children[i%3].appendChild(document.createTextNode(text));
        subConts.children[i%3].appendChild(document.createElement("br"));
    }

    //Append the elements to the document
    container.appendChild(subConts);
    popDiv.appendChild(container);
}

function dashes(){

    //Function to print several dashes for formatting
    var dashes = ""
    for(var i=0;i<100;i++){dashes+='-';}
    return dashes;
}

function All_Procreate(population, families, housing){

    for(var i=0;i<families.length;i++){
        var family = families[i];

        //Noisy linear function controling natural exponential growth, soft limit on children for each family
        var popMod = ((population.length-(main.time+30))/(main.time+30));
        var chance = (.75/(family.offspring+1))/(1+popMod);
        var rand = Math.random();

        //Establishes that the partners are in reproduction age range, both are alive, and there is housing to support more children in the village
        if (family.male.age<45 && family.female.age<45 && rand<=chance && family.dead==0 && population.length<housing){

            //Make babby
            offspring = new Person();
            offspring.sex = Assign_Sex();
            offspring.father = family.male;
            offspring.mother = family.female;
            offspring.first = Assign_First(offspring.sex);
            offspring.last = offspring.father.last;
            family.offspring++;
            population.push(offspring);
            Log(family.male.first+" "+family.male.last+" and "+family.female.first+" "+family.female.last+" have had a baby, "+offspring.first+"!");
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

function Match(person1,person2,families){
    var newFamily = new Family(person1,person2);
    Log(person1.first+" "+person1.last+" and "+person2.first+" "+person2.last+" have wed at the ages of "+person1.age+" and "+person2.age+"!");
    families.push(newFamily);
}

function Show_Tab(rightMenu,btnIdx){

    //Determines which menu is being accessed
    if(rightMenu){
        var info = document.getElementById("rightInfo").children;
        var menuBtns = document.getElementById("rightMenu").children;
    }
    else{
        var info = document.getElementById("leftInfo").children;
        var menuBtns = document.getElementById("leftMenu").children;
    }

    //Show the proper information, hide the rest, and format the buttons like tabs
    for(var i=0;i<info.length;i++){
        if(i==btnIdx){
            info[i].style.display="flex";
            menuBtns[i].style.borderBottom = "0";
        }
        else{
            info[i].style.display="none";
            menuBtns[i].style.borderBottom = "2px solid black";
        }
    }
}

function Increment_Worker(game,job,toAdd,reps){
    for(var i=0;i<reps;i++){

        //Checks if you are adding and can add or are subtracting and can subtract
        if((toAdd&&Check_Add_Worker(game,job)||(!toAdd&&Check_Subtract_Worker(game,job)))){
            var increment = -1;
            if(toAdd){
                increment = 1;
            }

            //Idle builders increases if you are adding a builder
            if(job==1){
                game.flow[0] += increment;
            }

            //Free building employment decreases when a worker is added
            var reqIdx = game.jobInfo[job].requireBuild;
            if(reqIdx!=null){
                game.flow[reqIdx] -= increment;
            }

            //Add or subtract worker to proper job, inversely affects idle workers
            game.jobs[job] += increment;
            game.flow[1] -= increment;
            Update_Resources(game,0);
            Update_Job(job,game);
        }
    }
}

function Check_Add_Worker(game,job){

    //If idle worker is available
    if(game.flow[1]>0){

        //If worker doesn't need supporting building
        if(game.jobInfo[job].requireBuild==null){
            return true;
        }

        //If building to support worker exists
        else if(game.flow[game.jobInfo[job].requireBuild]>0){
            return true;
        }
    }
    return false;
}

function Check_Subtract_Worker(game,job){

    //If worker count is greater than 0
    if(game.jobs[job]>0){

        //If the worker isn't a builder or there is at least one idle builder
        if(job!=1||game.flow[0]>0){
            return true;
        }
    }
    return false;
}

function Increment_Build(game,build,toAdd,reps){
    for(var i=0;i<reps;i++){

        //Checks if you are adding and can add or are subtracting and can subtract
        if((toAdd&&Check_Add_Building(game,build)||(!toAdd&&Check_Subtract_Building(game,build)))){
            if(toAdd){
                var increment = 1;
            }
            else{
                var increment = -1;
            }

            //Points to information needed for building
            var building = game.buildInfo[build]

            //Add or subtract building to this year's buildings and total buildings
            game.buildPlan[build] += increment;
            game.totalBuild[build] += increment;

            //Allocate costs and benefits
            game.resources[1] -= increment*(building.woodCost);
            game.resources[2] -= increment*(building.stoneCost);
            game.resources[3] += increment*(building.housing);
            game.resources[4] -= increment*(building.landCost);
            game.flow[0] -= increment*(building.buildCost);
            game.flow[2] += increment*(building.farming);
            game.flow[3] += increment*(building.lumber);
            game.flow[4] += increment*(building.stonePoint);
            game.flow[5] += increment*(building.millPoint);

            //Update related information
            Update_Resources(game,1);
            Update_Resources(game,0);
            Update_Buildings(build,game);
        }
    }
}

function Check_Add_Building(game,build){

    //Checks that all the costs are less than the resources needed
    if(game.resources[1]>=game.buildInfo[build].woodCost){
        if(game.resources[2]>=game.buildInfo[build].stoneCost){
            if(game.flow[0]>=game.buildInfo[build].buildCost){
                if(game.resources[4]>=game.buildInfo[build].landCost){
                    return true;
                }
            }
        }
    }
    return false;
}

function Check_Subtract_Building(game,build){

    //Checks that this building has been built this year
    if(game.buildPlan[build]>0){

        //Checks that the benefits of the building are not being used
        if(game.resources[3]>=game.buildInfo[build].housing){
            if(game.flow[3]>=game.buildInfo[build].lumber){
                if(game.flow[2]>=game.buildInfo[build].farming){
                    if(game.flow[4]>=game.buildInfo[build].stonePoint){
                        if(game.flow[5]>=game.buildInfo[build].millPoint){
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

function Update_Job(job,game){

    //Clears the container
    var role = document.getElementById("roles").children[job];
    role.removeChild(role.children[0]);

    //Creates a new span that has a mouse-over that indicates information and displays information relevant to that job
    var spn = document.createElement("span");
    spn.style.cursor = "help";
    switch(job){
        case 0:
            var t = ("Farmers: ");
            spn.title = "Farmers yield 2 food.  Farm necessary.";
            break;
        case 1:
            var t = ("Builders: ");
            spn.title = "Builders yield 1 build per year.";
            break;
        case 2:
            var t = ("Land Clearers: ");
            spn.title = "Land clearers yield 1 land.";
            break;
        case 3:
            var t = ("Woodcutters: ");
            spn.title = "Woodcutters yield 1 wood.  Requires lumber mill.";
            break;
        case 4:
            var t = ("Quarrymen : ");
            spn.title = "Quarrymen yield 1 stone.  Requires quarry.";
            break;
        case 5:
            var t = ("Millers : ");
            spn.title = "Millers increase farmer output by a small amount.  Requires mill.";
            break;
    }

    //Appends the actual number associated with that job
    t += game.jobs[job];

    //Fills the container
    spn.appendChild(document.createTextNode(t))
    role.appendChild(spn);
}

function Update_Buildings(build,game){

    //Clears the container
    var building = document.getElementById("buildings").children[build];
    building.removeChild(building.children[0]);

    //Creates a new span that has a mouse-over that indicates information and displays information relevant to that building
    var spn = document.createElement("span");
    spn.style.cursor = "help";
    switch(build){
        case 0:
            var t = ("Farms: ");
            spn.title = "Supports up to 5 farmers.\nCost:\n\t2 builders\n\t5 land"
            break;
        case 1:
            var t = ("Huts: ");
            spn.title = "Provide 2 housing.\nCost:\n\t1 builder\n\t1 wood\n\t1 land"
            break;
        case 2:
            var t = ("Cottages: ");
            spn.title = "Provide 5 housing.\nCost:\n\t1 builder\n\t1 wood\n\t1 stone\n\t1 land"
            break;
        case 3:
            var t = ("Lumber Mills: ");
            spn.title = "Supports up to 2 woodcutters.\nCost:\n\t3 builders\n\t2 wood\n\t2 land"
            break;
        case 4:
            var t = ("Quarries: ");
            spn.title = "Supports up to 2 quarrymen.\nCost:\n\t3 builders\n\t2 wood\n\t2 land"
            break;
        case 5:
            var t = ("Mills: ");
            spn.title = "Supports up to 2 millers.\nCost:\n\t2 builders\n\t2 wood\n\t2 stone\n\t2 land"
            break;
    }

    //Appends the actual number associated with that building
    t += game.totalBuild[build]

    //Fills the container
    spn.appendChild(document.createTextNode(t));
    building.appendChild(spn);
}

function Update_Resources(game,pit){

    //Whether or not it's the top row of resources
    if(pit){
        var resources = document.getElementById("resources").children;
    }
    else{
        var resources = document.getElementById("flow").children;
    }
    for(var i=0;i<resources.length;i++){

        //Clear only number, not icon
        resource = resources[i];
        resource.removeChild(resource.children[1]);
        var spn = document.createElement("span");

        //Picks from the appropriate resource vector
        if(pit){
            var t = game.resources[i];
        }
        else{
            var t = game.flow[i];
        }

        //Formats number
        if(t!=parseInt(t)){
            t = t.toFixed(1);
        }

        //Fills container
        spn.appendChild(document.createTextNode(t));
        resources[i].appendChild(spn);
    }
}

function Get_Workers(population){
    var workers = 0;
    for(var i=0;i<population.length;i++){

        //If pop fufills age requirement, pop is a worker.
        if(population[i].age<65 && population[i].age>=15){
            workers ++;
        }
    }
    return workers;
}

function Clear_Build_Plans(game){
    for(var i=0;i<game.buildPlan.length;i++){
        game.buildPlan[i] = 0;
    }

    //All builders become idle as they have finished their build from last turn
    game.flow[0] = game.jobs[1];
}

function Delete_Employees(game){
    var i = 0;
    var prevCount = 0;
    
    //If idle workers is negative, remove workers until that is no longer the case
    while(game.flow[1]<0){

        //If the worker is at 0, move on to the next worker
        if(game.jobs[i]==0){
            i++;
        }
        else{
            Increment_Worker(game,i,0,1);
        }
    }
}

function Init_New_Turn(game){

    //Idle workers now equals total workers - sum of the jobs vector (taken workers)
    game.flow[1] = Get_Workers(game.p)-game.jobs.reduce((a, b) => a + b, 0);

    //Remove employees if idle workers is negative
    Delete_Employees(game);

    //Update all on-screen information except buildings because this function does not affect that tab
    Update_Resources(game,1);
    Update_Resources(game,0);
    for(var i=0;i<game.jobs.length;i++){
        Update_Job(i,game);
    }
    Update_Food_Info(game);
}

function Update_Food_Info(game){

    //Empty container
    var foodInfo = document.getElementById("foodInfo");
    var children = foodInfo.children;
        while(children.length>0){
            foodInfo.removeChild(children[0]);
        }

    //Calculate and format optimal numbers of food workers in each position to minimize workers for food output of the current population
    var numPop = game.p.length;
    var millers = Math.max((Math.pow((12.5*numPop),.5) - 25),0);
    if(millers!=parseInt(millers)){
        millers = millers.toFixed(1);
    }
    var farmers = numPop/(.08*millers+2);
    if(farmers!=parseInt(farmers)){
        farmers = farmers.toFixed(1);
    }

    //Fill container
    var millText = "Optimal millers: " + millers;
    var millSpn = document.createElement("SPAN");
    millSpn.appendChild(document.createTextNode(millText));
    var farmText = "Optimal farmers: " + farmers;
    var farmSpn = document.createElement("SPAN");
    farmSpn.appendChild(document.createTextNode(farmText));
    foodInfo.appendChild(document.createElement("br"));
    foodInfo.appendChild(millSpn);
    foodInfo.appendChild(document.createElement("br"));    
    foodInfo.appendChild(farmSpn);
}

function Graph(game){

    //Push x and y
    game.grapher.push({x:game.time, y:game.p.length});

    //Actually update and draw the graph
    drawGraph(game);
}


function drawGraph(game){

    //Uses CanvasJS, make and draw chart object defined in their documentation
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
        toolTip:{
            borderColor: "black",
            fontColor: "black"
        },
	    data: [{
		    type: "line",
            color: "black",
		    dataPoints: game.grapher
	    }]
    });
    chart.render();
}

function Increment_Age(p){

    //New year, everyone is one year older
    for(var i=0;i<p.length;i++){
        p[i].age ++;
    }
}

function Log(str){

    //Create an element in the log tab containing the input string
    var log = document.getElementById("log");
    var spn = document.createElement("span");
    spn.style.margin = "0px 5px";
    spn.appendChild(document.createTextNode(str));
    log.appendChild(spn);
}

function Increment_Year(game){
    game.time ++;
    var population = game.p;
    var families = game.families

    Log(dashes());
    Log("Year "+game.time);
    Log(dashes());

    //Clears the build plan vector and refreshes idle builders for a new year
    Clear_Build_Plans(game);

    //Increments the population's age by 1
    Increment_Age(population);

    //Accrue and expend resources
    RESOURCES(game);

    //Population lives if they have a home, otherwise they succumb to the elements of the winter
    LIVE(game);

    //Some may die from old age
    OLD(game);

    //Create new children based on certain conditions
    All_Procreate(population, families, game.resources[3]);

    //Couples wed if conditions are met
    Find_Matches(population, families);  

    //Reset counters on workers and builders, remove impossible employees if employed exceeds total worker count, reset resource counts
    Init_New_Turn(game);

    //Updates population tab
    Disp_Pops(population);

    //Updates graph
    Graph(game);

    //Save game
    Save(game);
}

function Save(game){

    //Saves game in local storage of browser
    localStorage.setItem("game", JSON.stringify(game));
}

function Purge_Save(game){

    //Clears game object from local storage of browser
    localStorage.setItem("game", null);
    location.reload();
}

function LIVE(game){

    //Kills a random pop until housing is less than or equal to population
    while(game.p.length>game.resources[3]){
        var dead = Math.floor(Math.random()*game.p.length);
        KILL(game.p,dead,1);
    }
}

function RESOURCES(game){

    //Modifies the job's resource factor based on other jobs (ex. millers modify farmer food output)
    for(var i=0;i<game.jobs.length;i++){
        var job = game.jobInfo[i]
        if(job.modFactorIdx != null){
            game.jobInfo[job.modFactorIdx].factor += job.modFactor*game.jobs[i];
        }
    }

    //Resources are accrued based on the amount of people in each job and the job's resource factor
    for(var i=0;i<game.jobs.length;i++){
        var job = game.jobInfo[i]
        if(job.resource!=null){
            game.resources[job.resource] += job.factor*game.jobs[i];
        }
    }

    //Factors are reverted to pre-modified state
    for(var i=0;i<game.jobs.length;i++){
        var job = game.jobInfo[i]
        if(job.modFactorIdx != null){
            game.jobInfo[job.modFactorIdx].factor -= job.modFactor*game.jobs[i];
        }
    }

    //Population eats food throughout year or starves
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

    //Makes a check for every pop based on chance as to whether they live, very age-based
    //Killing removes the pop from the population vector, so only increment if not killing
    while(i<game.p.length){
        if (Math.random()>(1.006-(Math.pow(game.p[i].age,4)/400000000))){
            KILL(game.p,i,2);
        }
        else{
            i++;
        }
    }
}

function KILL(population,idx,type){

    //Log a situation-dependant string based on how they died
    var person = population[idx]
    var deathStr = (person.first+" "+person.last+" has died at "+person.age);
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
    }
    Log(deathStr);
    if (person.family!=null){
        person.family.dead = 1;
    }

    //Copy last pop onto dead pop and remove last pop, saving a lot of index resources
    population[idx] = population[population.length-1];
    population.pop();
}

function Main(){
    //Create initial pops
    var peopleStructs = Create_Initial_Families();

    //Set attributes
    this.p = peopleStructs[0];
    this.families = peopleStructs[1];
    this.time = 0;
    this.grapher = [{x:this.time, y:this.p.length}];
    this.resources = [0,0,0,0,0];
    this.flow = [0,0,0,0,0,0];
    this.jobs = [0,0,0,0,0,0];
    this.totalBuild = [0,0,0,0,0,0];
    this.buildPlan = [0,0,0,0,0,0];

    //Create information regarding buildings for:

    //Farms
    var farmInfo = new BuildInfo();
    farmInfo.landCost = 5;
    farmInfo.farming = 5;
    farmInfo.buildCost = 2;

    //Huts
    var hutInfo = new BuildInfo();
    hutInfo.woodCost = 1;
    hutInfo.housing = 2;

    //Cottages
    var cottageInfo = new BuildInfo();
    cottageInfo.woodCost = 1;
    cottageInfo.stoneCost = 1;
    cottageInfo.housing = 5;

    //Lumber mills
    var lumMillInfo = new BuildInfo();
    lumMillInfo.woodCost = 2;
    lumMillInfo.lumber = 2;
    lumMillInfo.landCost = 2;
    lumMillInfo.buildCost = 3;

    //Quarries
    var quarryInfo = new BuildInfo();
    quarryInfo.woodCost = 2;
    quarryInfo.stonePoint = 2;
    quarryInfo.landCost = 2;
    quarryInfo.buildCost = 3;

    //Mills
    var millInfo = new BuildInfo();
    millInfo.woodCost = 2;
    millInfo.stoneCost = 2;
    millInfo.landCost = 2;
    millInfo.buildCost = 2;
    millInfo.millPoint = 2;

    this.buildInfo = [farmInfo,hutInfo,cottageInfo,lumMillInfo,quarryInfo,millInfo];

    //Create information regarding jobs for:

    //Farmers
    var farmerInfo = new JobInfo();
    farmerInfo.resource = 0;
    farmerInfo.factor = 2;
    farmerInfo.requireBuild = 2;

    //Builders
    var builderInfo = new JobInfo();

    //Expanders
    var expandInfo = new JobInfo();
    expandInfo.resource = 4;

    //Woodcutters
    var woodCutInfo = new JobInfo();
    woodCutInfo.requireBuild = 3;
    woodCutInfo.resource = 1;

    //Stone Miners
    var quarrymanInfo = new JobInfo();
    quarrymanInfo.requireBuild = 4;
    quarrymanInfo.resource = 2;

    //Miller
    var millerInfo = new JobInfo();
    millerInfo.requireBuild = 5;
    millerInfo.resource = 2;
    millerInfo.modFactorIdx = 0;
    millerInfo.modFactor = .08;

    this.jobInfo = [farmerInfo,builderInfo,expandInfo,woodCutInfo,quarrymanInfo,millerInfo];
}

//Game object includes circular objects, so we need circular solution to stringify and save out the game
const JSON = CircularJSON;

//Global id, cannot set id based on length of population vector because people are being removed as they die
var pid = 0;

//Initialize new game if game does not exist, otherwise load game
if(JSON.parse(localStorage.getItem("game")) == null){
    var main = new Main();
    Initialize(main,1);
}
else{
    var main = JSON.parse(localStorage.getItem("game"));
    Initialize(main,0);
}

function Initialize(game,isNew){

    Log(dashes());
    Log("Year "+game.time);
    Log(dashes());

    //Set initial resources and log year 0 if starting a new game
    if(isNew){

        var logStr = "A few families and roamers have banded together to settle a new community."
        Log(logStr);

        //Set idle workers
        game.flow[1] = Get_Workers(game.p);

        //HARD CODED
        game.resources[0] = 20;
        game.resources[1] = 20;
        game.resources[4] = 50;
    }

    //Update all on-screen information
    for(var i=0;i<game.jobs.length;i++){
        Update_Job(i,game);
    }
    for(var i=0;i<game.buildPlan.length;i++){
        Update_Buildings(i,game);
    }
    Update_Resources(game,1);
    Update_Resources(game,0);
    Update_Food_Info(game);
    Disp_Pops(game.p);
    drawGraph(game);
}
