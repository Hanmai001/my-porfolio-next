import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { worksContent } from "@/shared/constants/works";
import { ProjectDetailView } from "@/features/project-detail/views/ProjectDetailView";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

function getProject(slug: string) {
  return worksContent.projects.find((project) => project.slug === slug && project.detail);
}

export function generateStaticParams() {
  return worksContent.projects
    .filter((project) => project.detail)
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.detail?.tagline ?? project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return <ProjectDetailView project={project} />;
}
