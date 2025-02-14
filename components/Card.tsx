import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CardWithForm(projectName: string) {
    return (
        <Card className="w-[680px]">
            <CardContent>
                <CardTitle className="p-4">{projectName}</CardTitle>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                    <p className=""></p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button>Deploy</Button>
            </CardFooter>
        </Card>
    )
}
