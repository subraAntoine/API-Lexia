import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    features: string[];
}

export function FeatureCard({ icon, title, description, features }: FeatureCardProps) {
    return (
        <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

            <CardHeader className="relative">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-violet-400">
                    {icon}
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardHeader>

            <CardContent className="relative">
                <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-violet-400" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
