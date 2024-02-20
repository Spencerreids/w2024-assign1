const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();
const supaUrl = 'https://dpurxnwnkjulaoflmhxw.supabase.co';
const supaAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwdXJ4bndua2p1bGFvZmxtaHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc3OTY4NTMsImV4cCI6MjAyMzM3Mjg1M30.OHzglWzCkve3ZzsOhrXv6slx3uvUgRiLODaBk7Jon6M';
const supabase = supa.createClient(supaUrl, supaAnonKey);


// All status info
app.get('/api/seasons', async (req, res) => {
    const {data, error} = await supabase
    .from('seasons')
    .select();
    res.send(data);
});
// All Circuit Info
app.get('/api/circuits', async (req, res) => {
    const {data, error} = await supabase
    .from('circuits')
    .select();
    res.send(data);
});
// Circuit info with a specific named referee
app.get('/api/circuits/:ref', async (req, res) => {
    if(typeof req.params.ref === "string"){
        const {data, error} = await supabase
        .from('circuits')
        .select()
        .like('circuitRef', `%` +req.params.ref.toLowerCase()+`%`);
        if (!data || data.length == 0){res.json({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.json({error: "Put in a string silly :p"})}
});
// Circuits within a given year
app.get('/api/circuits/season/:year', async (req, res) => {

    if(!isNaN(Number(req.params.year))){
        const {data, error} = await supabase
        .from('races')
        .select("circuits(*)", {distinct: true})
        .eq("year", req.params.year);
        if (!data || data.length == 0){res.json({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    
    else {res.json({error: "Put in a year silly :p"})}
});
// All Constructor info
app.get('/api/constructors', async (req, res) => {
    const {data, error} = await supabase
    .from('constructors')
    .select();
    res.send(data);
});
// Constructor info with a specific Ref
app.get('/api/constructors/:ref', async (req, res) => {
    if(typeof req.params.ref === "string"){
        const {data, error} = await supabase
        .from('constructors')
        .select()
        .ilike('constructorRef', req.params.ref.toLowerCase());
        if (!data || data.length == 0){res.json({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.json({error: "Put in a string silly :p"})}
});
// Constructor info within a specific year
app.get('/api/constructors/season/:year', async (req, res) => {

    if(!isNaN(Number(req.params.year))){
        const {data, error} = await supabase
        .from('constructorResults')
        .select("constructors(*), races!inner(year)", {distinct: true})
        .eq("races.year", req.params.year);
        if (!data || data.length == 0){res.json({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.json({error: "Put in a year silly :p"})}
});
// All Driver info
app.get('/api/drivers', async (req, res) => {
    const {data, error} = await supabase
    .from('drivers')
    .select();
    res.send(data);
});
// Drivers with a specific name 
app.get('/api/drivers/:ref', async (req, res) => {
    if(typeof req.params.ref === "string"){
        const {data, error} = await supabase
        .from('drivers')
        .select()
        .ilike('driverRef', req.params.ref.toLowerCase());
        if (!data || data.length == 0){res.json({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.json({error: "Put in a string silly :p"})}
});
// Drivers whos name begin with supplied string
app.get('/api/drivers/search/:sub', async (req, res) => {
    if(typeof req.params.sub === "string"){
        const {data, error} = await supabase
        .from('drivers')
        .select()
        .ilike("surname", req.params.sub + `%`);
        if (!data || data.length == 0){res.json({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.json({error: "Put in a string silly :p"})}
});
// Driver info within a specific year
app.get('/api/drivers/season/:year', async (req, res) => {
    if(!isNaN(Number(req.params.year))){
        const {data, error} = await supabase
        .from('results')
        .select("drivers(*), races!inner(year)", {distinct: true})
        .eq("races.year", req.params.year);
        if (!data || data.length == 0){res.json({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.json({error: "Put in a year silly :p"})}
});

app.get('/api/drivers/race/:raceid', async (req, res) => {
    if(!isNaN(Number(req.params.raceid))){
        const {data, error} = await supabase
        .from('results')
        .select("drivers(*),raceId", {distinct: true})
        .eq("raceId", req.params.raceid);
        if (!data || data.length == 0){res.json({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.json({error: "Put in a year silly :p"})}
});
// Race info with a specific ID
app.get('/api/races/:raceid', async (req, res) => {
    if(!isNaN(Number(req.params.raceid))){
        const {data, error} = await supabase
        .from('races')
        .select("*, circuits(name, location, country)")
        .eq('raceId', req.params.raceid);
        if (!data || data.length == 0){res.json({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.json({error: "Put in a string silly :p"})}
});
// Race info for a year (ordered by round)
app.get('/api/races/season/:year', async (req, res) => {
    if(!isNaN(Number(req.params.year))){
        const {data, error} = await supabase
        .from('races')
        .select()
        .eq("year", req.params.year)
        .order("round",{ascending:true});
        if (!data || data.length == 0){res.json({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.json({error: "Put in a year silly :p"})}
});
// Race info for the specific year, round combo provided
app.get('/api/races/season/:year/:round', async (req, res) => {
    if(!isNaN(Number(req.params.year)) && !isNaN(Number(req.params.round))){
        const {data, error} = await supabase
        .from('races')
        .select()
        .match({year: req.params.year, round: req.params.round});
        if (!data || data.length == 0){res.json({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.json({error: "Put in a year and round correctly silly :p"})}
});
// Return all races on a given circuit (ordered by year)
app.get('/api/races/circuits/:ref', async (req, res) => {
    if(typeof req.params.ref === "string"){
        const {data, error} = await supabase
        .from('races')
        .select('*, circuits!inner(circuitRef)')
        .ilike('circuits.circuitRef', req.params.ref)
        .order("year",{ascending:true});
        if (!data || data.length == 0){res.json({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.json({error: "Put in a circuit name silly :p"})}
});
// Races info on a certain track, and used between two years.
app.get('/api/races/circuits/:ref/season/:year1/:year2', async (req, res) => {
    if((typeof req.params.ref === "string") && (!isNaN(Number(req.params.year1))) && (!isNaN(Number(req.params.year2)))){
        let larger = req.params.year1;
        let smaller = req.params.year2;
        if(smaller > larger){
            smaller = req.params.year1;
            larger = req.params.year2;
        }
        const {data, error} = await supabase
        .from('races')
        .select('*, circuits!inner(circuitRef)')
        .ilike('circuits.circuitRef', req.params.ref)
        .gte("year", smaller)
        .lte("year", larger)
        .order("year",{ascending:true});
        if (!data || data.length == 0){res.json({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.json({error: "Put in a circuit name and years correctly silly :p"})}
});
// Results info, grouped by provided race (ordered by grid)
app.get('/api/results/:raceid', async (req, res) => {
    if(!isNaN(Number(req.params.raceid))){
        const {data, error} = await supabase
        .from('results')
        .select(`*, 
                drivers(driverRef, code, forename, surname), 
                races(name, round, year, date),
                constructors(name, constructorRef, nationality)`)
        .eq("raceId", req.params.raceid)
        .order("grid",{ascending:true});
        if (!data || data.length == 0){res.json({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.json({error: "Put in a year silly :p"})}
});
// Results info for a given driver
app.get('/api/results/driver/:ref', async (req, res) => {
    if(typeof req.params.ref === "string"){
        const {data, error} = await supabase
        .from('results')
        .select(`*, 
                drivers!inner(driverRef, code, forename, surname), 
                races(name, round, year, date),
                constructors(name, constructorRef, nationality)`)
        .eq("drivers.driverRef", req.params.ref);
        if (!data || data.length == 0){res.json({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.json({error: "Put in a year silly :p"})}
});



app.listen(8080, () => {
    console.log('listening on port 8080');
        // console.log('http://localhost:8080/api/seasons');
        // console.log('http://localhost:8080/api/circuits');
        // console.log('http://localhost:8080/api/circuits/monza');
        // console.log('http://localhost:8080/api/circuits/calgary');??
        // console.log('http://localhost:8080/api/constructors');
        // console.log('http://localhost:8080/api/constructors/ferrari');
        // console.log('http://localhost:8080/api/constructors/season/2020');
        // console.log('http://localhost:8080/api/drivers');
        // console.log('http://localhost:8080/api/drivers/Norris');
        // console.log('http://localhost:8080/api/drivers/norris');
        // console.log('http://localhost:8080/api/drivers/connolly');??
        // console.log('http://localhost:8080/api/drivers/search/sch');
        // console.log('http://localhost:8080/api/drivers/search/xxxxx');??
        // console.log('http://localhost:8080/api/drivers/season/2022');
        // console.log('http://localhost:8080/api/drivers/race/1069');
        // console.log('http://localhost:8080/api/races/1034');
        // console.log('http://localhost:8080/api/races/season/2021');
        // console.log('http://localhost:8080/api/races/season/2020/2022');??
        // console.log('http://localhost:8080/api/races/season/2022/2020');??
        // console.log('http://localhost:8080/api/races/circuits/7');??
        // console.log('http://localhost:8080/api/races/circuits/7/season/2015/2022');??
        // console.log('http://localhost:8080/api/results/1106');
    // console.log('http://localhost:8080/api/results/driver/max_verstappen');
    // console.log('http://localhost:8080/api/results/driver/connolly');
    // console.log('http://localhost:8080/api/results/drivers/sainz/seasons/2021/2022');
    // console.log('http://localhost:8080/api/qualifying/1106');
    // console.log('http://localhost:8080/api/standings/drivers/1120');
    // console.log('http://localhost:8080/api/standings/constructors/1120');
    // console.log('http://localhost:8080/api/standings/constructors/asds');
});
