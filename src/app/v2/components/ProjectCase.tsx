import Link from 'next/link'
import type { PortfolioProject, ProjectStoryBlock } from '@/types'
import ActionButton from './ActionButton'
import Eyebrow from './Eyebrow'
import TagList from './TagList'
import type { PortfolioItem } from '../content'
import styles from './ProjectCase.module.css'

type Copy = {
  crumbHome: string
  crumb: string
  readMore: string
  visit: string
  aboutEyebrow: string
  aboutHeading: string
  factDate: string
  factField: string
  factType: string
  factTech: string
  challengeEyebrow: string
  challengeHeading: string
  solutionEyebrow: string
  solutionHeading: string
  shotAlt: string
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.fact}>
      <span className={styles.factLabel}>{label}</span>
      <span className={styles.factValue}>{value}</span>
    </div>
  )
}

function Story({
  block,
  eyebrow,
  heading,
  headingId,
  flip,
  alt,
}: {
  block: ProjectStoryBlock
  eyebrow: string
  heading: string
  headingId: string
  flip: boolean
  alt: string
}) {
  return (
    <section className={styles.story} aria-labelledby={headingId}>
      <div className={styles.storyInner} data-flip={flip || undefined}>
        <div className={styles.storyCopy} data-reveal-item>
          <Eyebrow label={eyebrow} dot="rtl" />
          <h2 id={headingId} className={styles.heading}>
            {heading}
          </h2>
          <p className={styles.storyText}>{block.text}</p>
        </div>

        {block.image ? (
          <div className={styles.storyMedia} data-reveal-item>
            <div className={styles.shotFrame}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={block.image} alt={alt} className={styles.shotImage} loading="lazy" />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function ProjectIntro({
  project,
  item,
  copy,
}: {
  project: PortfolioProject
  item?: PortfolioItem
  copy: Copy
}) {
  const shot = project.screenshot || project.image
  const tags = item?.tags?.length ? item.tags : project.tags

  return (
    <section className={styles.intro} aria-labelledby="v2-project-heading">
      <div className={styles.introInner}>
        <div className={styles.copy} data-reveal-item>
          <nav className={styles.crumbs} aria-label={copy.crumb}>
            <Link href="/v2">{copy.crumbHome}</Link>
            <span className={styles.crumbSep} aria-hidden="true">
              ·
            </span>
            <Link href="/v2/projects">{copy.crumb}</Link>
            <span className={styles.crumbSep} aria-hidden="true">
              ·
            </span>
            <span>{project.title}</span>
          </nav>

          <h1 id="v2-project-heading" className={styles.title}>
            {project.title}
          </h1>

          {tags.length ? <TagList tags={tags} /> : null}

          {project.heroDescription ? <p className={styles.lede}>{project.heroDescription}</p> : null}

          <ActionButton href="#v2-project-about" label={copy.readMore} />
        </div>

        {shot ? (
          <div className={styles.shotPanel} data-reveal-item>
            <div className={styles.shotFrame}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot}
                alt={project.imageAlt || `${copy.shotAlt} ${project.title}`}
                className={styles.shotImage}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function ProjectAbout({
  project,
  item,
  copy,
}: {
  project: PortfolioProject
  item?: PortfolioItem
  copy: Copy
}) {
  const paragraphs = project.caseStudy?.length
    ? project.caseStudy
    : project.heroDescription
      ? [project.heroDescription]
      : []

  const live = project.liveSiteUrl || project.externalUrl
  const tech = project.technology || project.tags.slice(0, 3).join(' · ')

  return (
    <section id="v2-project-about" className={styles.about} aria-labelledby="v2-project-about-heading">
      <div className={styles.aboutInner}>
        <Eyebrow label={copy.aboutEyebrow} dot="rtl" />
        <h2 id="v2-project-about-heading" className={styles.heading}>
          {copy.aboutHeading}
        </h2>

        {paragraphs.map((text) => (
          <p key={text.slice(0, 40)} className={styles.body}>
            {text}
          </p>
        ))}

        <div className={styles.facts}>
          {project.launchedAt ? <Fact label={copy.factDate} value={project.launchedAt} /> : null}
          {project.category ? <Fact label={copy.factField} value={project.category} /> : null}
          {project.projectType || item ? (
            <Fact label={copy.factType} value={project.projectType || project.category} />
          ) : null}
          {tech ? <Fact label={copy.factTech} value={tech} /> : null}
        </div>

        {live ? (
          <ActionButton href={live} label={copy.visit} className={styles.aboutAction} />
        ) : null}
      </div>
    </section>
  )
}

export function ProjectStory({ project, copy }: { project: PortfolioProject; copy: Copy }) {
  return (
    <>
      {project.challenge ? (
        <Story
          block={project.challenge}
          eyebrow={copy.challengeEyebrow}
          heading={copy.challengeHeading}
          headingId="v2-project-challenge"
          flip={false}
          alt={`${copy.shotAlt} ${project.title}`}
        />
      ) : null}

      {project.solution ? (
        <Story
          block={project.solution}
          eyebrow={copy.solutionEyebrow}
          heading={copy.solutionHeading}
          headingId="v2-project-solution"
          flip
          alt={`${copy.shotAlt} ${project.title}`}
        />
      ) : null}
    </>
  )
}
