"use client"; 
import { useState, useEffect } from "react";
import { CardWithForm } from "@/components/Card"
import { Button } from "@/components/ui/button";

interface typeProjects {
    id: string;
    name: string;
    projectStartTime: number;
    totalElapsedTime: number;
    isRunning: boolean;
}

export default function Timer(){
    //プロジェクトに関する状態管理
    const [projects, setProjects] = useState<typeProjects[]>([]);

    // LocalStorageからデータを読み込む
    useEffect(() => {
        const savedProjects = localStorage.getItem('projects');
        if (savedProjects) {
            setProjects(JSON.parse(savedProjects));
        }
    }, []);

    // データが更新されたらLocalStorageに保存
    useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(projects));
    }, [projects]);

    // プロジェクトの追加
    const addProject = () => {
        const newProject: typeProjects = {
            id: crypto.randomUUID(),
            name: `プロジェクト：${projects.length + 1}`,
            projectStartTime: Date.now(),
            totalElapsedTime: 0,
            isRunning: false,
        }
        setProjects([...projects, newProject])
    }

    const toggleTimer = (id: string) => {
        setProjects(projects.map((project) => {
            if (project.id === id) {
                if (project.isRunning) {
                    return {
                        ...project,
                        isRunning: false,
                        totalElapsedTime: project.totalElapsedTime + (Date.now() - project.projectStartTime)
                    };
                } else {
                    return {
                        ...project,
                        isRunning: true,
                        projectStartTime: Date.now()
                    };
                }
            }
            return project;
        }));
    }

    const deleteProject = (id: string) => {
        setProjects(projects.filter((project) => project.id !== id))
    }

    // プロジェクト名の更新
    const updateProjectName = (id: string, newName: string) => {
        setProjects(projects.map((project) =>
            project.id === id ? {...project, name: newName} : project
        ));
    }

    return (
        <div className="container mx-auto p-10">
            <h1 className="text-xl md:text-3xl font-bold text-center">稼働時間管理</h1>
            <Button
                variant="destructive"
                onClick={addProject}
                className="font-bold mb-8"
            >
                プロジェクト追加
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <CardWithForm 
                        key={project.id}
                        projectId={project.id}
                        projectName={project.name}
                        projectStartTime={project.projectStartTime}
                        totalElapsedTime={project.totalElapsedTime}
                        isRunning={project.isRunning}
                        toggleTimer={toggleTimer}
                        deleteProject={deleteProject}
                        updateProjectName={updateProjectName}
                    />
                ))}
            </div>
        </div>
    )
}