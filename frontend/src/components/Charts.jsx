// src/components/Charts.jsx
import { useEffect, useState } from "react"
import axios from "axios"
import * as d3 from "d3"

const Charts = ({ taskId }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/tasks/${taskId}/data`)
      .then(res => {
        console.log("📦 Received chart data:", res.data)
  
        if (!res.data || res.data.length === 0) {
          console.warn("⚠️ No records found for this task.")
          setData([])  // optional: show message in UI
          return
        }
  
        const parsed = res.data.map(d => ({
          ...d,
          date_of_sale: new Date(d.date_of_sale)
        }))
        setData(parsed)
      })
      .catch(err => console.error("❌ Failed to fetch task data", err))
  }, [taskId])
  
  

  if (data.length === 0) return <p className="mt-4 text-gray-500 text-center">Loading chart data...</p>

  // Grouping data
  const salesByCompany = d3.rollups(data, v => d3.sum(v, d => d.price), d => d.company)
  const salesByDate = d3.rollups(data, v => v.length, d => d.date_of_sale.getFullYear())

  return (
    <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Sales by Company</h3>
            <BarChart data={salesByCompany} />
        </div>
      </div>
      <div>
        <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Sales Over Time</h3>
        <LineChart data={salesByDate} />
        </div>
      </div>
    </div>
  )
}

const BarChart = ({ data }) => {
  const ref = useD3((svg) => {
    svg.selectAll("*").remove()

    const width = 300
    const height = 200
    const margin = { top: 10, right: 10, bottom: 40, left: 50 }

    const x = d3.scaleBand()
      .domain(data.map(d => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.2)

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[1])])
      .range([height - margin.bottom, margin.top])

    svg
      .attr("width", width)
      .attr("height", height)

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))

    svg.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", d => x(d[0]))
      .attr("y", d => y(d[1]))
      .attr("width", x.bandwidth())
      .attr("height", d => y(0) - y(d[1]))
      .attr("fill", "steelblue")
  }, [data])

  return <svg ref={ref}></svg>
}

const LineChart = ({ data }) => {
  const ref = useD3((svg) => {
    svg.selectAll("*").remove()

    const width = 300
    const height = 200
    const margin = { top: 10, right: 10, bottom: 40, left: 50 }

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d[0]))
      .range([margin.left, width - margin.right])

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[1])])
      .range([height - margin.bottom, margin.top])

    const line = d3.line()
      .x(d => x(d[0]))
      .y(d => y(d[1]))

    svg
      .attr("width", width)
      .attr("height", height)

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")))

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line)
  }, [data])

  return <svg ref={ref}></svg>
}

const useD3 = (renderChartFn, dependencies) => {
  const ref = useState(() => document.createElementNS("http://www.w3.org/2000/svg", "svg"))[0]
  useEffect(() => {
    renderChartFn(d3.select(ref))
  }, dependencies)
  return (el) => el?.appendChild(ref)
}

export default Charts
