const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

const employees = [];

const getEmployeeType = () => {
    inquirer
        .prompt([{
                name: 'employeeType',
                type: 'list',
                message: 'Employee type?',
                choices: ['Manager', 'Engineer', 'Intern'],
            }]
        ).then((answers) => {
            if (answers.employeeType === 'Manager') {
                var managerExists = employees.some((e) => e instanceof Manager);
                if (managerExists) {
                    console.log('\n\nManager already exists\n\n');
                    getEmployeeType();
                }
                else {
                    getEmployeeInfo(answers.employeeType);
                }
            }
            else {
                getEmployeeInfo(answers.employeeType);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

const getEmployeeInfo = (type) => {

    var e = {};
    var answers = {};

    const commonInfo = [{
            name: 'employeeName',
            message: 'Employee Name?',
        },
        {
            name: 'employeeId',
            message: 'Employee ID?',
        },
        {
            name: 'employeeEmail',
            message: 'Employee Email?',
        }];

    const engineerInfo = [{
        name: 'gitHub',
        message: 'GitHub?',
    }];

    const managerInfo = [{
        name: 'officeNo',
        message: 'Office number?',
    }];

    const internInfo = [{
        name: 'school',
        message: 'School?',
    }];

    const goBack = [{
        name: 'back',
        type: 'list',
        message: 'Go again?',
        choices: ['Yes', 'No'],
    }];

    switch (type) {
        case 'Manager':
            commonInfo.push(managerInfo[0]);
            commonInfo.push(goBack[0]);
            inquirer.prompt(commonInfo).then((a) => {
                    answers = a;
                    //console.log(answers);
                    e = new Manager(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.officeNo);
                    employees.push(e);
                    if (answers.back === 'Yes') {
                        commonInfo.pop();
                        commonInfo.pop();
                        getEmployeeType();
                    }
                    else {
                        renderOutput(render(employees));
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            break;
        case 'Engineer':
            commonInfo.push(engineerInfo[0]);
            commonInfo.push(goBack[0]);
            inquirer.prompt(commonInfo).then((a) => {
                    answers = a;
                    e = new Engineer(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.gitHub);
                    employees.push(e);
                    if (answers.back === 'Yes') {
                        commonInfo.pop();
                        commonInfo.pop();
                        getEmployeeType();
                    }
                    else {
                        renderOutput(render(employees));
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            break;
        case 'Intern':
            commonInfo.push(internInfo[0]);
            commonInfo.push(goBack[0]);
            inquirer.prompt(commonInfo).then((a) => {
                    answers = a;
                    e = new Intern(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.school);
                    employees.push(e);
                    if (answers.back === 'Yes') {

                        commonInfo.pop();
                        commonInfo.pop();
                        getEmployeeType();
                    }
                    else {
                        renderOutput(render(employees));
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            break;
    }
}

const renderOutput = (output) => {
    if (!fs.existsSync(OUTPUT_DIR)){
        fs.mkdirSync(OUTPUT_DIR);
    }
    fs.writeFile(outputPath, output, function (err) {
        if (err) return console.log(err);
        console.log('\n\n\nRender complete !!!');
    });
}

getEmployeeType();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!```