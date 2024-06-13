import {Request} from "./request";
import {UI} from "./ui";

const form = document.getElementById("employee-form");
const name = document.getElementById("name");
const department = document.getElementById("department");
const salary = document.getElementById("salary");
const employeeList = document.getElementById("employees");
const updateEmployeeButton = document.getElementById("update");

const request = new Request("http://localhost:3000/employees");
const ui = new UI();
let updateState = null;

eventListeners();

function eventListeners(){
    document.addEventListener("DOMContentLoaded",getAllEmployees);
    form.addEventListener("submit",addEmployee);
    employeeList.addEventListener("click",updateORdelete);
    updateEmployeeButton.addEventListener("click",updateEmployee);
}

function updateEmployee(){
    if(updateState){
        const data = {name:name.value.trim(),department:department.value.trim(),salary:salary.value.trim()};
        request.put(updateState.updateID,data)
        .then(updatedEmployee => {
            ui.updateEmployee(updatedEmployee,updateState.updateParent);
        })
        .catch(err => console.log(err));
    }

}

function updateORdelete(e){

    if(e.target.id === "update-employee"){
        updateEmployeeController(e.target.parentElement.parentElement);

    }else if(e.target.id === "delete-employee"){
        deleteEmployee(e.target);
    }
}

function updateEmployeeController(employeeTarget){
    ui.targetUpdateBuntton(employeeTarget);
    if(updateState === null){
        updateState = {
            updateID : employeeTarget.children[3].textContent,
            updateParent : employeeTarget
        }
    }else{
        updateState = null;
    }
}

function deleteEmployee(employee){
    const id = employee.parentElement.previousElementSibling.previousElementSibling.textContent;
    request.delete(id)
    .then(message => {
        ui.deleteEmployeeFromUI(employee.parentElement.parentElement);
    })
    .catch(err => console.log(err))
}

function addEmployee(e){
    
    const employeeName = name.value.trim();
    const employeeDepartment = department.value.trim();
    const employeeSalary = salary.value.trim();

    if(employeeName === "" || employeeDepartment === "" || employeeSalary === ""){
        alert("Lütfen tüm alanlari doldurun");
    }else{
        request.post({name:employeeName,department:employeeDepartment,salary:employeeSalary})
        .then(employee => {
            ui.addNewEmployee(employee);
        })
        .catch(err => console.log(err));
    }
    ui.clearInputs();
    e.preventDefault();
}

function getAllEmployees(){
    request.get()
    .then(employees => {
        ui.addAllEmployees(employees);
       
    })
    .catch(err => console.log(err));
}

