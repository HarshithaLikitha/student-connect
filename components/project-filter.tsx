"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProjectFilter({
  projects,
  onFilterChange,
}: {
  projects: any[]
  onFilterChange: (filteredProjects: any[]) => void
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTech, setSelectedTech] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState("")

  // Extract all unique technologies from projects
  const allTechnologies = Array.from(new Set(projects.flatMap((project) => project.tech))).sort()

  // Filter projects based on current filters
  const filterProjects = () => {
    const filtered = projects.filter((project) => {
      // Filter by search term
      const matchesSearch =
        searchTerm === "" ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.team && project.team.toLowerCase().includes(searchTerm.toLowerCase()))

      // Filter by selected technologies
      const matchesTech = selectedTech.length === 0 || selectedTech.some((tech) => project.tech.includes(tech))

      // Filter by status
      const matchesStatus = selectedStatus === "" || project.status === selectedStatus

      return matchesSearch && matchesTech && matchesStatus
    })

    onFilterChange(filtered)
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setTimeout(filterProjects, 300)
  }

  // Handle technology selection
  const handleTechClick = (tech: string) => {
    setSelectedTech((prev) => {
      const newSelection = prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]

      setTimeout(() => filterProjects(), 100)
      return newSelection
    })
  }

  // Handle status selection
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    setTimeout(filterProjects, 100)
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedTech([])
    setSelectedStatus("")
    onFilterChange(projects)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects or teams..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <Select value={selectedStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Planning">Planning</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={resetFilters} className="gap-2">
          <X className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Technologies:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {allTechnologies.map((tech) => (
            <Badge
              key={tech}
              variant={selectedTech.includes(tech) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleTechClick(tech)}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
