import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardTitle,
} from "@/components/ui/card"

interface CardProps {
    projectId: number;
    projectName: string;
    startTime: number | null;
    elapsedTime: number;
    endTime: number | null;
    isRunning: boolean;
}
export function CardWithForm(
    projectName: string,
    time: number,

) {
    return (
        <Card className="w-[680px]">
            <CardContent>
                <CardTitle className="p-4">{projectName}</CardTitle>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                    <p>経過時間：{Math.floor(elapsedTime / 1000)}秒</p>
                    <button onClick={() => toggleTimer(project.id)}>
                        {project.isRunning ? "一時停止" : "開始"}
                    </button>
                    <button onClick={() => deleteProject(project.id)}>削除</button>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button>Deploy</Button>
            </CardFooter>
        </Card>
    )
}
