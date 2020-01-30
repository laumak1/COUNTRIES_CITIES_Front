
var selectedRow = null;
var updateId = null;
var tableOrder = "";

//atidaromas langas su pasirinktos šalies duomenimis
function openCities(kazkas){
    console.log('open cities');
    localStorage.setItem("currentCountry",kazkas);
    window.open("./cities.html#", "_self");
}


//prideda naują arba atnaujina įrašą
function onFormSubmit(){
    if(validate()){
        var formData = readFormData();
        if(selectedRow == null){
            //insertNewReacordToTable(formData);
            //console.log('insert');
            createRequest(formData);
            updateTable();
        }else{
            //console.log('update');
            updateRecord(formData);
            updateRequest(updateId, formData)
            updateTable();
        }   
        resetForm();
        modal.style.display = "none";//uždaro modal
        //console.log('prideta');
    }
}

//nuskaitomi duomenys iš formos ir gražinamas objektas
function readFormData(){
    var formData = {};
    formData["name"] = document.getElementById("name").value;
    formData["area"] = document.getElementById("area").value;
    formData["population"] = document.getElementById("population").value;
    formData["calling_code"] = document.getElementById("calling_code").value;
    return formData;
}

//pridedamas įrašas į lentelę
function insertNewReacordToTable(data){
    var table = document.getElementById("countriesList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = `<a onClick="openCities(` + data.id + `)">`+data.name+`</a>`;
    cell1 = newRow.insertCell(1);
    cell1.innerHTML = data.area;
    cell1 = newRow.insertCell(2);
    cell1.innerHTML = data.population;
    cell1 = newRow.insertCell(3);
    cell1.innerHTML = data.calling_code;
    cell1 = newRow.insertCell(4);
    cell1.innerHTML = `<a onClick="onEdit(this, ` + data.id + `)"><i class="fas fa-pencil-alt fa-lg"></i></a> <i class="fas fa-grip-lines-vertical fa-lg"></i>
                        <a onClick="onDelete(this, ` + data.id + `)"><i class="fas fa-trash-alt fa-lg"></i></a>`;
}

//ištrinami formos laukai
function resetForm(){
    document.getElementById("name").value = "";
    document.getElementById("area").value = "";
    document.getElementById("population").value = "";
    document.getElementById("calling_code").value = "";
    selectedRow = null;
}

//užkraunami formos laukai ir atidaromas modalinis langas
function onEdit(td, id){
    selectedRow = td.parentElement.parentElement;
    document.getElementById("name").value = selectedRow.cells[0].innerText;
    document.getElementById("area").value = selectedRow.cells[1].innerHTML;
    document.getElementById("population").value = selectedRow.cells[2].innerHTML;
    document.getElementById("calling_code").value = selectedRow.cells[3].innerHTML;
    modal.style.display = "block";//atidaro modal
    updateId = id;
}

//klausia ar tikrai nori pašalinti ir tada pašalina
function onDelete(td, id){
    if(confirm('Ar tikrai norite panaikinti įrašą?')){
        deleteRequest(id);
        resetForm();
        updateTable();
    }
    
}

//atnaujinami laukai
function updateRecord(formData){
    selectedRow.cells[0].innerHTML = formData.name;
    selectedRow.cells[1].innerHTML = formData.area;
    selectedRow.cells[2].innerHTML = formData.population;
    selectedRow.cells[3].innerHTML = formData.calling_code;
}


//duomenų įvedimo formos laukų patikrinimas
function validate(){
    isValid = true;
    if(document.getElementById("name").value != ""){
        isValid = true;
    }
    else{
        isValid = false;
        return isValid;
    }
    if(document.getElementById("area").value != "" &&  /^\d+$/.test(document.getElementById("area").value)){
        isValid = true;
    }
    else{
        isValid = false;
        return isValid;
    }
    if(document.getElementById("population").value != "" &&  /^\d+$/.test(document.getElementById("population").value)){
        isValid = true;
    }
    else{
        isValid = false;
        return isValid;
    }
    if(document.getElementById("calling_code").value != "" && document.getElementById("calling_code").value.length <= 12){
        isValid = true;
    }
    else{
        isValid = false;
        return isValid;
    }
    return isValid;
}


//duomenų įvedimo forma
//------------------------------
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  resetForm();//ištrina form
}

//get funkcija. iš API gauna duomenis
getRequest();
function getRequest(){
    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest();


    var page = document.getElementsByClassName("pagination").item(0).getElementsByClassName("active").item(0).innerText;//-----------------------------------------------------------------
    if(page == "")
        page = 1;
        //console.log(page)

    var order = tableOrder;
    var text = document.getElementById("searchByName").value;
    var date = document.getElementById("filterByDate").value;
    var link = 'https://akademija.teltonika.lt/api1/countries?page=' + page + '&order=' + order + '&text=' + text ;
    if(date != '') link = link + '&date=' + date;//data atskirai, nes su tuščia neveikia
    //console.log(link);

    request.open('GET', link, false);

    request.onload = function() {
        var getData = JSON.parse(this.response);
        //console.log(getData.countires);

        if (request.status >= 200 && request.status < 400) {
            getData.countires.forEach(country => {   
                insertNewReacordToTable(country);
            })
        } else {
        //console.log('error in get');
        }
    }
    // Send request
    request.send();
}

// Delete
function deleteRequest(itemId){
    //console.log('deleting' + itemId);
    var request = new XMLHttpRequest();
    // Open a new connection, using the GET request on the URL endpoint
    request.open('DELETE', 'https://akademija.teltonika.lt/api1/countries/'+ itemId, false);
    request.send();
    showSnack("Šalis pašalinta iš sąrašo");
}

// Update
function updateRequest(itemId, data){
    var request = new XMLHttpRequest();

    request.open("PUT", 'https://akademija.teltonika.lt/api1/countries/'+ itemId, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({
    name: data.name,
    area: data.area,
    population: data.population,
    calling_code: data.calling_code
    }));
    //console.log(data);
    if (request.status >= 200 && request.status < 400) {
        //console.log('ok');
    } else {
    //console.log('error in update' + request.response);
    }
    showSnack("Šalis atnaujinta");
}

//Create
function createRequest(data){
    var request = new XMLHttpRequest();

    request.open("POST", 'https://akademija.teltonika.lt/api1/countries', false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({
    name: data.name,
    area: data.area,
    population: data.population,
    calling_code: data.calling_code
    }));
    if (request.status >= 200 && request.status < 400) {
        //console.log('ok');
    } else {
    //console.log('error in create' + request.response);
    }
    showSnack("Šalis pridėta prie sąrašo");
}

// funkcija, skirta atnaujinti lentelę. naudojama keliose vietose
function updateTable(){

    var rowCount = document.getElementById("countriesList").rows.length; 
    while(--rowCount) 
        document.getElementById("countriesList").deleteRow(rowCount); 
    getRequest();

    //pageing
    if(document.getElementById("countriesList").rows.length < 11){
        document.getElementById('nextPage').style.visibility = 'hidden';
        if(document.getElementsByClassName("pagination").item(0).getElementsByClassName("active").item(0).innerText <= 1){
            document.getElementById('prevPage').style.visibility = 'hidden';
            document.getElementsByClassName("pagination").item(0).getElementsByClassName("active").item(0).style.visibility = 'hidden';
        //console.log('viskas paslepta---------------');
        }
    } else{
        document.getElementById('nextPage').style.visibility = 'visible';
        document.getElementById('prevPage').style.visibility = 'visible';
        document.getElementsByClassName("pagination").item(0).getElementsByClassName("active").item(0).style.visibility = 'visible';
        //console.log('viskas rodoma---------------');
    }
        
    //console.log(document.getElementById("countriesList").rows.length);
}



//duomenų rikiavimui
function sortList(){
    if(tableOrder == "")
    tableOrder = "asc";
    else if (tableOrder == "asc") {
        tableOrder = "desc";
    } else {
        tableOrder = "asc";
    }
    //console.log(tableOrder);
    updateTable();
}






//pageing -------------------------------------

// grįšti į ankstesnį puslapį
function prevPage(){
    var activePage = document.getElementsByClassName("pagination").item(0).getElementsByClassName("active").item(0).innerText;
    if(activePage > 1)
    changePage(--activePage);
}

//eiti į kitą puslapį
function nextPage(){
    var activePage = document.getElementsByClassName("pagination").item(0).getElementsByClassName("active").item(0).innerText;
    changePage(++activePage);
    
}

//kviečiama iš prevPage() ir nextPage()
function changePage(changeTo){
    document.getElementsByClassName("pagination").item(0).getElementsByClassName("active").item(0).innerText = changeTo;
    updateTable();
    
}

//paduodamas message ir rodomas pranešimas
function showSnack(message) {
    var x = document.getElementById("snackbar");
    x.innerText = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

//užkraunami naujausi duomenys
updateTable();



