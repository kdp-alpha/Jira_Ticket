let addbtn = document.querySelector(".add-btn");
let removebtn = document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textarea = document.querySelector(".textarea-cont");
let allPrioritycolors = document.querySelectorAll(".prioritycolors");
let lockbtn = document.querySelector(".ticket-lock");
let toolBoxColors = document.querySelectorAll(".color");

let colors = ["lightpink","lightblue","lightgreen","black"];
let modalPriority = colors[colors.length-1];

let ticketsArr = [];


let addFlag = false;
let removeFlag = false;


let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";


if(localStorage.getItem("Jira_Ticket")){
    // RETRIEVE & DISPLAY TICKETS
    let newArr = JSON.parse(localStorage.getItem("Jira_Ticket"));
    newArr.forEach((ticketObj) =>{
        createTicket(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID);
    });
}


for(let i = 0 ; i < toolBoxColors.length ; i++){
    toolBoxColors[i].addEventListener("click" , (e) => {
        let currentToolboxColor = toolBoxColors[i].classList[0];
        console.log(currentToolboxColor);
        let allTicketsCont  = document.querySelectorAll(".ticket-cont");
        for(let i = 0 ; i < allTicketsCont.length ; i++){
            let ticketheadercolor = allTicketsCont[i].querySelector(".ticket-color");
            let currentTicketColor = ticketheadercolor.classList[1];
            console.log(currentTicketColor);
            if(currentTicketColor == currentToolboxColor){
                allTicketsCont[i].style.display = "block";
            }else{
                allTicketsCont[i].style.display = "none";
            }
        }
    })

    toolBoxColors[i].addEventListener("dblclick" , function(e){
        let allTicketsCont  = document.querySelectorAll(".ticket-cont");
        for(let i = 0 ; i < allTicketsCont.length ; i++){
            allTicketsCont[i].style.display = "block";
        }
    })
}


allPrioritycolors.forEach((colorelem, idx) =>{
    colorelem.addEventListener("click",(e) =>{
        allPrioritycolors.forEach((prioritycolors,idx) =>{
            prioritycolors.classList.remove("border");
        })
        colorelem.classList.add("border");

        modalPriority = colorelem.classList[0];

    })
})

addbtn.addEventListener("click", (e) => {
    // Display Modal
    // Generate ticket

    // AddFlag, true -> Modal Display
    // AddFlag, False -> Modal None
    addFlag = !addFlag;
    if (addFlag) {
        modalCont.style.display = "flex";
    }
    else {
        modalCont.style.display = "none";
    }
})

removebtn.addEventListener("click", (e)=>{
   removeFlag =! removeFlag

})

modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if(key=="Shift")
    {
        createTicket(modalPriority,textarea.value,shortid());
        setDefault();
        addFlag = false;

       
       
    }
})

function createTicket(ticketColor, ticketTask, ticketID) {
    let id = ticketID || shortid();
  let ticketcont = document.createElement("div");
  ticketcont.setAttribute("class", "ticket-cont");
  ticketcont.innerHTML = ` 
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-cont">${ticketTask}</div>
    <div class="ticket-lock">
    <i class="fas fa-lock"></i>
    </div>`;

    ticketsArr.push({ticketColor,ticketTask,ticketID})
    localStorage.setItem("Jira_Ticket",JSON.stringify(ticketsArr));

    mainCont.appendChild(ticketcont);

    
    handleRemove(ticketcont,ticketID)
    handleLock(ticketcont,ticketID);
    handleColor(ticketcont,ticketID);
}
function handleRemove(ticket , id){
    // remove flag -> true -> remove
    ticket.addEventListener("click" , function(e){
        if(removeFlag){
            // DB REMOVAL
            console.log(true);
            let ticketIdx = getTicketidx(id);
            ticketsArr.splice(ticketIdx , 1);
            let strTicketsArr = JSON.stringify(ticketsArr);
            localStorage.setItem("Jira_Ticket" , strTicketsArr);
            ticket.remove(); // UI REMOVAL
         }
         
    
        // removeFlag = false;    
    })
}


function handleLock(ticket, id) {
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-cont");
    ticketLock.addEventListener("click", (e) => {
        
        let ticketIDX = getTicketidx(id);

        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable", "true");
        }
        else {
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable", "false");
        }

        ticketsArr[ticketIDX].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem("Jira_Ticket",JSON.stringify(ticketsArr));
        
    })
}

function handleColor(ticket,id)
{
    let ticketColor = ticket.querySelector(".ticket-color");

    ticketColor.addEventListener("click",(e) => {

        let ticketIDX = getTicketidx(id);

        let currentTicketcolor = ticketColor.classList[1];
        //get idx
        let currentTicketcolorIDX = colors.findIndex((color) => {
            return currentTicketcolor === color;
        })
        console.log(currentTicketcolor,currentTicketcolorIDX);
        currentTicketcolorIDX++;    
        let newTicketColorIDX = currentTicketcolorIDX % colors.length;
        let newTicketColor = colors[newTicketColorIDX];
        ticketColor.classList.remove(currentTicketcolor)
        ticketColor.classList.add(newTicketColor)

        //Modify data in local storage
        ticketsArr[ticketIDX].ticketColor = newTicketColor;
        localStorage.setItem("Jira_Ticket",JSON.stringify(ticketsArr))//color change
    })
   
}

function setDefault(){
    modalCont.style.display = "none";
    textarea.value = ""
    modalPriority = colors[colors.length-1];
    for(let i=0;i<allPrioritycolors;i++)
    {
        allPrioritycolors[i].classList.remove("border");
    }
    allPrioritycolors[allPrioritycolors.length-1].classList.add("border")

}

function getTicketidx(id)
{
    let ticketIDX = ticketsArr.findIndex((ticketObj) => {
        return ticketObj.ticketID === id;
    })

    return ticketIDX;

}

