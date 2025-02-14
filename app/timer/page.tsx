"use client"; 
import { useState, useEffect } from "react";
import { CardWithForm } from "@/components/Card"
import { Button } from "@/components/ui/button";
type typeProjects = {
    id: number;
    name: string;
    startTime: number | null;
    elapsedTime: number;
    endTime: number | null;
    isRunning: boolean;
}

export default function Timer(){
    //プロジェクトに関する状態管理
    const [projects, setProjects] = useState<typeProjects[]>([]);

    // タイマー更新
    useEffect(() => {
        const interval = setInterval(() => {
            setProjects((prevProjects) => 
            prevProjects.map((project) => {
                if(project.isRunning && project.startTime !== null){
                    return {
                        ...project,
                        elapsedTime: Date.now() - project.startTime
                    };
                }
                return project;
            }))
        }, 1000);
        return () => clearInterval(interval)
    }, [])


    // プロジェクトの追加
    const addProject = () => {
        setProjects([
            ...projects,
            {
                id: Date.now(),
                name: `Project ${projects.length + 1} `,
                startTime: null,
                elapsedTime: 0,
                endTime: null,
                isRunning: false,
            },
        ])
    }

    const deleteProject = (id: number) => {
        setProjects(projects.filter((project) => project.id !== id))
    }

    const toggleTimer = (id: number) => {
        setProjects((prevProjects) => 
            prevProjects.map((project) => 
                project.id === id ? {
                    ...project,
                    isRunning: !project.isRunning,
                    startTime: project.isRunning ? null : Date.now() - project.elapsedTime,
                }
                : project
            )
        )
    }

    return (
        <div className="conatiner mx-auto p-10">
            <h1 className="text-xl md:text-3xl font-bold text-center">稼働時間管理</h1>
            <Button
                variant="destructive"
                onClick={addProject}
                className="font-bold mb-8"
            >
                プロジェクト追加
            </Button>
            {projects.map((project) => (
                <div key={project.id}>
                    {CardWithForm(project.name, project.elapsedTime)}
                    
                </div>
            ))}
        </div>
    )
}