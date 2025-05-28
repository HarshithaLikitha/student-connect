"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { Card, CardContent } from "@/components/ui/card"

interface Node {
  id: number
  name: string
  type: "community" | "project"
  group: number
}

interface Link {
  source: number
  target: number
  value: number
}

interface GraphData {
  nodes: Node[]
  links: Link[]
}

export function ProjectConnectionGraph({
  community,
  projects,
  interlinkedCommunities,
}: {
  community: any
  projects: any[]
  interlinkedCommunities: any[]
}) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !community || !projects || !interlinkedCommunities) return

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove()

    // Prepare data for the graph
    const nodes: Node[] = [
      // Main community
      { id: community.id, name: community.name, type: "community", group: 1 },

      // Projects
      ...projects.map((project) => ({
        id: project.id + 1000, // Add offset to avoid ID conflicts
        name: project.name,
        type: "project",
        group: 2,
      })),

      // Interlinked communities
      ...interlinkedCommunities.map((c) => ({
        id: c.id,
        name: c.name,
        type: "community",
        group: 3,
      })),
    ]

    const links: Link[] = [
      // Links from main community to its projects
      ...projects.map((project) => ({
        source: community.id,
        target: project.id + 1000,
        value: 1,
      })),

      // Links from interlinked communities to shared projects
      ...interlinkedCommunities.flatMap((c) =>
        c.sharedProjects.map((projectId) => ({
          source: c.id,
          target: projectId + 1000,
          value: 1,
        })),
      ),
    ]

    const data: GraphData = { nodes, links }

    // Set up the SVG
    const width = svgRef.current.clientWidth
    const height = 400

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])

    // Create a simulation with forces
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40))

    // Define color scale for nodes
    const color = d3.scaleOrdinal().domain(["1", "2", "3"]).range(["#4f46e5", "#10b981", "#f59e0b"])

    // Create links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.sqrt(d.value))

    // Create node groups
    const node = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, Node>().on("start", dragstarted).on("drag", dragged).on("end", dragended))

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", (d) => (d.type === "community" ? 25 : 15))
      .attr("fill", (d) => color(d.group.toString()))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)

    // Add text labels to nodes
    node
      .append("text")
      .text((d) => (d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name))
      .attr("x", 0)
      .attr("y", (d) => (d.type === "community" ? 35 : 25))
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#333")

    // Add tooltips
    node.append("title").text((d) => d.name)

    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node.attr("transform", (d) => `translate(${d.x},${d.y})`)
    })

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }

    function dragged(event: any) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }

    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [community, projects, interlinkedCommunities])

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2">Project Connections</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Visualizing connections between communities and projects. Drag nodes to explore relationships.
        </p>
        <div className="border rounded-md bg-background">
          <svg ref={svgRef} className="w-full" />
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
            <span>This Community</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
            <span>Projects</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <span>Related Communities</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
