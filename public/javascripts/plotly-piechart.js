// let values = []
// let labels = []

// Record.aggregate([{ $group: { _id: "$category", total: { $sum: "$cost" } } }])
//   .then(records => {
//     records.forEach((record) => {
//       values.push(record.total)
//       labels.push(record._id)
//     })
//   })

// let data = [{
//   type: "pie",
//   values: values,
//   labels: labels,
//   textinfo: "label",
//   textposition: "outside",
//   hole: .4,
//   automargin: true
// }]

// const layout = {
//   height: 400,
//   width: 400,
//   margin: { "t": 0, "b": 0, "l": 0, "r": 0 },
//   showlegend: false
// }

// Plotly.newPlot('myDiv', data, layout)
