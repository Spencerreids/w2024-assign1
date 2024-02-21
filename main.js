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
    .select(`circuitRef, name, location, country, lat, lng, alt, url`);
    res.send(data);
});
// Circuit info with a specific named referee
app.get('/api/circuits/:ref', async (req, res) => {
    if(typeof req.params.ref === "string"){
        const {data, error} = await supabase
        .from('circuits')
        .select(`circuitRef, name, location, country, lat, lng, alt, url`)
        .like('circuitRef', `%` +req.params.ref.toLowerCase()+`%`);
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a string silly :p"})}
});
// Circuits within a given year
app.get('/api/circuits/season/:year', async (req, res) => {
    if(!isNaN(Number(req.params.year))){
        const {data, error} = await supabase
        .from('circuits')
        .select(`*, races!inner()`)
        .eq("races.year", req.params.year);
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a year silly :p"})}
});
// All Constructor info
app.get('/api/constructors', async (req, res) => {
    const {data, error} = await supabase
    .from('constructors')
    .select(`constructorRef, name, nationality, url`);
    res.send(data);
});
// Constructor info with a specific Ref
app.get('/api/constructors/:ref', async (req, res) => {
    if(typeof req.params.ref === "string"){
        const {data, error} = await supabase
        .from('constructors')
        .select(`constructorRef, name, nationality, url`)
        .ilike('constructorRef', req.params.ref.toLowerCase());
        if (!data || data.length == 0){res.send({error: "Nothing found :/ Matching is strict check your spelling"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a consructor name silly :p"})}
});
// Constructor info within a specific year
app.get('/api/constructors/season/:year', async (req, res) => {

    if(!isNaN(Number(req.params.year))){
        const {data, error} = await supabase
        .from('constructorResults')
        .select("constructors(constructorRef, name, nationality, url), races!inner()", {distinct: true})
        .eq("races.year", req.params.year);
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a year silly :p"})}
});
// All Driver info
app.get('/api/drivers', async (req, res) => {
    const {data, error} = await supabase
    .from('drivers')
    .select(`driverRef, number, code, surname, forename, dob, nationality, url`);
    res.send(data);
});
// Drivers with a specific name 
app.get('/api/drivers/:ref', async (req, res) => {
    if(typeof req.params.ref === "string"){
        const {data, error} = await supabase
        .from('drivers')
        .select(`driverRef, number, code, surname, forename, dob, nationality, url`)
        .ilike('driverRef', req.params.ref.toLowerCase());
        if (!data || data.length == 0){res.send({error: "Nothing found :/ Matching is strict, check your spelling"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a driver ref silly :p"})}
});
// Drivers whos name begin with supplied string
app.get('/api/drivers/search/:sub', async (req, res) => {
    if(typeof req.params.sub === "string"){
        const {data, error} = await supabase
        .from('drivers')
        .select(`driverRef, number, code, surname, forename, dob, nationality, url`)
        .ilike("surname", req.params.sub + `%`);
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in the first letters of a driver's name silly :p"})}
});
// Driver info within a specific year
app.get('/api/drivers/season/:year', async (req, res) => {
    if(!isNaN(Number(req.params.year))){
        const {data, error} = await supabase
        .from('results')
        .select(`drivers(driverRef, number, code, surname, forename, dob, nationality, url), 
                races!inner()`, {distinct: true})
        .eq("races.year", req.params.year);
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a year silly :p"})}
});

app.get('/api/drivers/race/:raceid', async (req, res) => {
    if(!isNaN(Number(req.params.raceid))){
        const {data, error} = await supabase
        .from('results')
        .select(`drivers(driverRef, number, code, surname, forename, dob, nationality, url),
                raceId`, {distinct: true})
        .eq("raceId", req.params.raceid);
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a race ID number silly :p"})}
});
// Race info with a specific ID
app.get('/api/races/:raceid', async (req, res) => {
    if(!isNaN(Number(req.params.raceid))){
        const {data, error} = await supabase
        .from('races')
        .select(`year, round, name, date, time, url, fp1_date, fp1_time, 
                fp2_date, fp2_time, fp3_date, fp3_time, quali_date, quali_time,
                sprint_date, sprint_time,  
                circuits(name, location, country)`)
        .eq('raceId', req.params.raceid);
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a race ID number silly :p"})}
});
// Race info for a year (ordered by round)
app.get('/api/races/season/:year', async (req, res) => {
    if(!isNaN(Number(req.params.year))){
        const {data, error} = await supabase
        .from('races')
        .select(`year, round, name, date, time, url, fp1_date, fp1_time, 
                fp2_date, fp2_time, fp3_date, fp3_time, quali_date, quali_time,
                sprint_date, sprint_time`)
        .eq("year", req.params.year)
        .order("round",{ascending:true});
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a year silly :p"})}
});
// Race info for the specific year, round combo provided
app.get('/api/races/season/:year/:round', async (req, res) => {
    if(!isNaN(Number(req.params.year)) && !isNaN(Number(req.params.round))){
        const {data, error} = await supabase
        .from('races')
        .select(`year, round, name, date, time, url, fp1_date, fp1_time, 
                fp2_date, fp2_time, fp3_date, fp3_time, quali_date, quali_time,
                sprint_date, sprint_time`)
        .match({year: req.params.year, round: req.params.round});
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a year and round correctly silly :p"})}
});
// Return all races on a given circuit (ordered by year)
app.get('/api/races/circuits/:ref', async (req, res) => {
    if(typeof req.params.ref === "string"){
        const {data, error} = await supabase
        .from('races')
        .select(`year, round, circuitId,name, date, time, url, fp1_date, fp1_time, 
                fp2_date, fp2_time, fp3_date, fp3_time, quali_date, quali_time,
                sprint_date, sprint_time, circuits!inner()`)
        .ilike('circuits.circuitRef', req.params.ref)
        .order("year",{ascending:true});
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a circuit name silly :p"})}
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
        .select(`year, round, circuitId,name, date, time, url, fp1_date, fp1_time, 
                fp2_date, fp2_time, fp3_date, fp3_time, quali_date, quali_time,
                sprint_date, sprint_time, circuits!inner()`)
        .ilike('circuits.circuitRef', req.params.ref)
        .gte("year", smaller)
        .lte("year", larger)
        .order("year",{ascending:true});
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a circuit name and the years correctly silly :p"})}
});
// Results info, grouped by provided race (ordered by grid)
app.get('/api/results/:raceid', async (req, res) => {
    if(!isNaN(Number(req.params.raceid))){
        const {data, error} = await supabase
        .from('results')
        .select(`number, grid, position, positionText, positionOrder, points, laps, 
                time, milliseconds, fastestLap, fastestLapTime,
                fastestLapSpeed, status(status), 
                drivers(driverRef, code, forename, surname), 
                races(name, round, year, date),
                constructors(name, constructorRef, nationality)`)
        .eq("raceId", req.params.raceid)
        .order("grid",{ascending:true});
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a race ID number silly :p"})}
});
// Results info for a given driver
app.get('/api/results/driver/:ref', async (req, res) => {
    if(typeof req.params.ref === "string"){
        const {data, error} = await supabase
        .from('results')
        .select(`number, grid, position, positionText, positionOrder, points, laps, 
                time, milliseconds, fastestLap, fastestLapTime,
                fastestLapSpeed, status(status), 
                drivers!inner(driverRef, code, forename, surname), 
                races(name, round, year, date),
                constructors(name, constructorRef, nationality)`)
        .eq("drivers.driverRef", req.params.ref);
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a driver ref silly :p"})}
});
// Results info for a given driver, within a range of years
app.get('/api/results/driver/:ref/season/:year1/:year2', async (req, res) => {
    if((typeof req.params.ref === "string") && (!isNaN(Number(req.params.year1))) && (!isNaN(Number(req.params.year2)))){
        let larger = req.params.year1;
        let smaller = req.params.year2;
        if(smaller > larger){
            smaller = req.params.year1;
            larger = req.params.year2;
        }
        const {data, error} = await supabase
        .from('results')
        .select(`number, grid, position, positionText, positionOrder, points, laps, 
                time, milliseconds, fastestLap, fastestLapTime,
                fastestLapSpeed, status(status), 
                drivers!inner(driverRef, code, forename, surname), 
                races!inner(name, round, year, date),
                constructors(name, constructorRef, nationality)`)
        .eq("drivers.driverRef", req.params.ref)
        .gte("races.year", smaller)
        .lte("races.year", larger);
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a driver ref and the years correctly silly :p"})}
});
// Qualifying info for a specific race (ordered by position)
app.get('/api/qualifying/:raceid', async (req, res) => {
    if(!isNaN(Number(req.params.raceid))){
        const {data, error} = await supabase
        .from('qualifying')
        .select(`number, position, q1,q2,q3,
                drivers(driverRef, code, forename, surname),
                races(name, round, year, date),
                constructors(name, constructorRef, nationality)
                `)
        .eq("raceId", req.params.raceid)
        .order("position",{ascending:true});
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a race ID silly :p"})}
});
// Standings info for a specific race
app.get('/api/standings/:raceid/drivers', async (req, res) => {
    if(!isNaN(Number(req.params.raceid))){
        const {data, error} = await supabase
        .from('driverStandings')
        .select(`points, position, positionText, wins,
                drivers(driverRef, code, forename, surname)
                `)
        .eq("raceId", req.params.raceid)
        .order("position",{ascending:true});
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a race ID silly :p"})}
});

app.get('/api/standings/:raceid/constructors', async (req, res) => {
    if(!isNaN(Number(req.params.raceid))){
        const {data, error} = await supabase
        .from('constructorStandings')
        .select(`points, position, positionText, wins,
                constructors(name, constructorRef, nationality)
                `)
        .eq("raceId", req.params.raceid)
        .order("position",{ascending:true});
        if (!data || data.length == 0){res.send({error: "Nothing found :/"})}
        else {res.send(data);}
    }
    else {res.send({error: "Put in a race ID silly :p"})}
});



app.listen(8080, () => {
    console.log('listening on port 8080');
});
