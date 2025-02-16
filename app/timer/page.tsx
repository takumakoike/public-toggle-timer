"use client"; 
import { useState, useEffect } from "react";
import { CardWithForm } from "@/components/Card"
import { Button } from "@/components/ui/button";
import { supabase} from "@/lib/supabase"

interface typeProjects {
    id: string;
    name: string;
    project_start_time: number;
    total_elapsed_time: number;
    is_running: boolean;
    created_at?: string;
}

export default function Timer(){
    //プロジェクトに関する状態管理
    const [projects, setProjects] = useState<typeProjects[]>([]);
    const [loading, setLoading] = useState(true);

    // LocalStorageからデータを読み込む
    useEffect(() => {
        const fetchProjects = async () => {
            try{
                const { data, error} = await supabase
                    .from("projects")
                    .select("*")
                    .order("created_at", { ascending: true})

                if (error) throw error;
                setProjects(data || []); 
            } catch(error){
                console.error("Error:", error)
            } finally {
                setLoading(false);
            }
        }

        fetchProjects();

        const subscription = supabase
            .channel("projects")
            .on(
                'postgres_changes' as never, 
                { event: "*", schema: "public", table: "projects" },
                (payload) => {
                    if(payload.eventType === "INSERT"){
                        setProjects(prev => [...prev, payload.new as typeProjects]);
                    } else if (payload.eventType === "DELETE"){
                        setProjects(prev => prev.filter(project => project.id !== (payload.old as typeProjects).id));
                    } else if (payload.eventType === "UPDATE"){
                        setProjects(prev => prev.map(project => 
                            project.id === (payload.new as typeProjects).id ? payload.new as typeProjects : project
                        ));
                    }
                }
            )
            .subscribe();
        return () => {
            subscription.unsubscribe();
        }
    }, []);

    // プロジェクトの追加
    const addProject = async () => {
        try {
            const newProject = {
                name: `プロジェクト：${projects.length + 1}`,
                project_start_time: Date.now(),
                total_elapsed_time: 0,
                is_running: false,
            };

            // 即座にUIを更新（一時的なIDを生成）
            const tempProject = {
                ...newProject,
                id: crypto.randomUUID(),
                created_at: new Date().toISOString()
            };
            setProjects(prev => [...prev, tempProject]);

            // その後でサーバーと同期
            const { data, error } = await supabase
                .from("projects")
                .insert([newProject])
                .select();

            if (error) {
                console.error("Error adding project:", error.message);
                // エラーが発生した場合は元の状態に戻す
                setProjects(prev => prev.filter(p => p.id !== tempProject.id));
                return;
            }

            // 一時的なプロジェクトを実際のデータで置き換え
            setProjects(prev => prev.map(p => 
                p.id === tempProject.id ? data[0] : p
            ));
        } catch (error) {
            console.error("Error in addProject:", error);
        }
    };

    const toggleTimer = async (id: string) => {
        try {
            const project = projects.find(p => p.id === id);
            if (!project) return;

            const updates = project.is_running
                ? {
                    is_running: false,
                    total_elapsed_time: project.total_elapsed_time + (Date.now() - project.project_start_time)
                }
                : {
                    is_running: true,
                    project_start_time: Date.now()
                };

            // 即座にUIを更新
            setProjects(prev => prev.map(p => 
                p.id === id ? { ...p, ...updates } : p
            ));

            // その後でサーバーと同期
            const { error } = await supabase
                .from("projects")
                .update(updates)
                .eq("id", id);

            if (error) {
                console.error("Error updating project:", error.message);
                // エラーが発生した場合は元の状態に戻す
                const { data } = await supabase
                    .from("projects")
                    .select("*")
                    .order("created_at", { ascending: true });
                setProjects(data || []);
            }
        } catch (error) {
            console.error("Error in toggleTimer:", error);
        }
    };

    const deleteProject = async(id: string) => {
        try {
            // 即座にUIを更新
            setProjects(prev => prev.filter(project => project.id !== id));

            // その後でサーバーと同期
            const { error } = await supabase
                .from("projects")
                .delete()
                .eq("id", id);

            if (error) {
                console.error("Error deleting project:", error);
                // エラーが発生した場合は元の状態に戻す
                const { data } = await supabase
                    .from("projects")
                    .select("*")
                    .order("created_at", { ascending: true });
                setProjects(data || []);
            }
        } catch (error) {
            console.error("Error in deleteProject:", error);
        }
    };

    // プロジェクト名の更新
    const updateProjectName = async (id: string, newName: string) => {
        try {
            // 即座にUIを更新
            setProjects(prev => prev.map(p => 
                p.id === id ? { ...p, name: newName } : p
            ));

            // その後でサーバーと同期
            const { error } = await supabase
                .from("projects")
                .update({ name: newName })
                .eq("id", id);

            if (error) {
                console.error("Error updating project name:", error);
                // エラーが発生した場合は元の状態に戻す
                const { data } = await supabase
                    .from("projects")
                    .select("*")
                    .order("created_at", { ascending: true });
                setProjects(data || []);
            }
        } catch (error) {
            console.error("Error in updateProjectName:", error);
        }
    };

    if(loading){
        return <div>読み込み中...</div>
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
                        projectStartTime={project.project_start_time}
                        totalElapsedTime={project.total_elapsed_time}
                        isRunning={project.is_running}
                        toggleTimer={toggleTimer}
                        deleteProject={deleteProject}
                        updateProjectName={updateProjectName}
                    />
                ))}
            </div>
        </div>
    )
}