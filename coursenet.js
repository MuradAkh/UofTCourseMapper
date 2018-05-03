

let button = document.getElementById('run');
button.onclick = function execute() {
    let input = document.getElementById('courses').value;
    input = input.replace(/\s/g, '');
    console.log(input);
    let courses = input.split(',');
    let courseMap = [];

    courses.forEach(function (element) {
        addCourse(element)
    });


    function addCourse(element) {
        let response = getInfo(element, 0).concat(getInfo(element, 100));
        let regexp = /[A-Z]{3}[0-9]{3}/gi ;
        response.forEach(function (course) {
                let code = course.code.substring(0, 6);
                let temp = courseMap[code];
            if (temp == null) {
                    courseMap[code] = {code: code, prereq: course.prerequisites.match(regexp)}
                }
            }
        )


    }

    let allNodes = [];
    let allEdges =[];

    Object.keys(courseMap).forEach(function(key) {
        let val = courseMap[key];
        allNodes.push({id: val.code , label: val.code, onclick: displayInfo()});
        if(val.prereq != null) {
            val.prereq.forEach(function (element) {
                allEdges.push({to: val.code, from: element})
            })
        }

    });


    function getInfo(code, skip) {
        let res = "error";
        let xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let myArr = JSON.parse(this.responseText);
                res = myArr;
            }
        };
        xmlhttp.open("GET", 'https://cors.io/?https://cobalt.qas.im/api/1.0/courses/filter?q=code:%22' + code + '%22&key=bolBkU4DDtKmXbbr4j5b0m814s3RCcBm&limit=100&campus:"UTSG"&skip=' + skip, false);
        xmlhttp.send();

        return res;
    }




    let nodes = new vis.DataSet(allNodes);


    let edges = new vis.DataSet(allEdges);

// create a network
    let container = document.getElementById('mynetwork');

// provide the data in the vis format
    let data = {
        nodes: nodes,
        edges: edges
    };
    let options = {
        edges:{
            arrows: 'to',
            color: 'red',
            font: '12px arial #ff0000',
            scaling:{
                label: true,
            },
            shadow: true,
            smooth: true,
        },
        layout: {
            randomSeed: undefined,
            improvedLayout: true,
            hierarchical: {
                enabled: true,
                levelSeparation: 150,
                nodeSpacing: 200,
                treeSpacing: 50,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: false,
                direction: 'UD',        // UD, DU, LR, RL
                sortMethod: 'hubsize'   // hubsize, directed
            }
        },
        physics: false,
        interaction: {
            selectNode: displayInfo
        }
    };

// initialize your network!
    let network = new vis.Network(container, data, options);
    network.redraw();

    function displayInfo(element) {
        console.log(element);

    }

};



