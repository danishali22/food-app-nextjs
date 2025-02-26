"use client"

interface HeadingProps {
    title: string,
    description: string,
}

const Heading = ({title, description}: HeadingProps) => {
  return (
    <div className="w-full">
        <h2 className="text-3xl font-bold tracking-tighter">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export default Heading