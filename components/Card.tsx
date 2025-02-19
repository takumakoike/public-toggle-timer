import * as React from "react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export const CardWithForm: React.FC<{
    projectId: string;
    projectName: string;
    projectStartTime: number;
    totalElapsedTime: number;
    isRunning: boolean;
    toggleTimer: (id: string) => void;
    deleteProject: (id: string) => void;
    updateProjectName: (id: string, newName: string) => void;
}> = ({ projectId, projectName, projectStartTime, totalElapsedTime, isRunning, toggleTimer, deleteProject, updateProjectName }) => {
    const [elapsed, setElapsed] = useState<number>(totalElapsedTime);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(projectName);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        
        if (isRunning) {
            setElapsed(totalElapsedTime + (Date.now() - projectStartTime));
            intervalId = setInterval(() => {
                setElapsed(totalElapsedTime + (Date.now() - projectStartTime));
            }, 1000);
        } else {
            setElapsed(totalElapsedTime);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning, projectStartTime, totalElapsedTime]);

    const handleNameSubmit = () => {
        updateProjectName(projectId, editedName);
        setIsEditing(false);
    }

    return (
        <Card>
            <CardContent>
                <div className="p-4">
                    {isEditing ? (
                        <div className="flex gap-2">
                            <Input
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                            />
                            <Button onClick={handleNameSubmit}>保存</Button>
                            <Button onClick={() => setIsEditing(false)}>キャンセル</Button>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center">
                            <CardTitle>{projectName}</CardTitle>
                            <Button variant="ghost" onClick={() => setIsEditing(true)}>
                                編集
                            </Button>
                        </div>
                    )}
                </div>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <p>経過時間：{Math.floor(elapsed / 1000)}秒</p>
                        <Button onClick={() => toggleTimer(projectId)}>
                            {isRunning ? "一時停止" : "開始"}
                        </Button>
                        <Button onClick={() => deleteProject(projectId)}>削除</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
