//update graph function

var data = []
pos = slider_1.position.x
const write_data = function (c){
    new_pos = slider_1.position.x
    if (new_pos > pos + 0.1){
        Events.off(engine,'afterUpdate', write_data)
        document.getElementById("amp_up").disabled = false
        document.getElementById("amp_down").disabled = false;
    }
    pos = slider_1.position.x
    data.push({x: ((((slider_1.position.x - 260))/260 - 1)* -1).toFixed(2), y: ((((Top.position.y - 290) * -1)/290)).toFixed(2)})
    myChart.update();
}
const check_graph = function(c){
    if (slider_1.position.x > 525){
        Events.on(engine, 'afterUpdate', write_data)
        Events.off(engine,'afterUpdate', check_graph)
    }
}


//graph button
document.querySelector("#graph").addEventListener('click', function () {
    Events.on(engine, 'afterUpdate', check_graph);
    document.getElementById("graph").disabled = true
    document.getElementById("amp_up").disabled = true
    document.getElementById("amp_down").disabled = true;
});

//copy button
document.querySelector("#copy").addEventListener('click', function () {
    copy_clipboard(data);
});
function copy_clipboard(arr) {
    str = JSON.stringify(arr)
    str = str.replace(/{/g, '')
    str = str.replace(/}/g, '')
    str = str.replace(/"/g, '')
    window.prompt("Copy to clipboard: Ctrl+C, Enter", str);
};


const ctx = document.getElementById('myChart');
let myChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        data: data,
        backgroundColor: 'rgb(6, 62, 123)',
        borderColor: 'rgb(6, 62, 123)'
      }]
    },
    options: {
        scales: {
            x: {
                beginAtZero: true,
                type: 'linear',
                suggestedMin: 0,
                suggestedMax: 1,
                },
            y: {
                beginAtZero: true,
                type: 'linear',
                suggestedMin: 0,
                suggestedMax: 1,
            }
        },
        datasets: {
            line: {
                pointRadius: 0 // disable for all `'line'` datasets
            }
        },
    }
})