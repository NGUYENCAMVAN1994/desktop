import * as React from 'react'
import { join } from 'path'
import { LinkButton } from '../lib/link-button'
import { Button } from '../lib/button'
import { Monospaced } from '../lib/monospaced'
import { Repository } from '../../models/repository'
import { Dispatcher } from '../dispatcher'
import { Octicon, OcticonSymbol } from '../octicons'
import {
  ValidTutorialStep,
  TutorialStep,
  orderedTutorialSteps,
} from '../../models/tutorial-step'
import { encodePathAsUrl } from '../../lib/path'

const TutorialPanelImage = encodePathAsUrl(
  __dirname,
  'static/required-status-check.svg'
)

interface ITutorialPanelProps {
  readonly dispatcher: Dispatcher
  readonly repository: Repository

  /** name of the configured external editor
   * (`undefined` if none is configured.)
   */
  readonly externalEditorLabel?: string
  readonly currentTutorialStep: ValidTutorialStep
}

interface ITutorialPanelState {
  /** ID of the currently expanded tutorial step */
  readonly currentlyOpenSectionId: ValidTutorialStep
}

/** The Onboarding Tutorial Panel
 *  Renders a list of expandable tutorial steps (`TutorialListItem`).
 *  Enforces only having one step expanded at a time through
 *  event callbacks and local state.
 */
export class TutorialPanel extends React.Component<
  ITutorialPanelProps,
  ITutorialPanelState
> {
  public constructor(props: ITutorialPanelProps) {
    super(props)
    this.state = { currentlyOpenSectionId: this.props.currentTutorialStep }
  }

  private openTutorialFileInEditor = () => {
    this.props.dispatcher.openInExternalEditor(
      // TODO: tie this filename to a shared constant
      // for tutorial repos
      join(this.props.repository.path, 'README.md')
    )
  }

  private openPullRequest = () => {
    this.props.dispatcher.createPullRequest(this.props.repository)
  }

  private skipEditorInstall = () => {
    this.props.dispatcher.skipPickEditorTutorialStep(this.props.repository)
  }

  private skipCreatePR = () => {
    this.props.dispatcher.skipCreatePullRequestTutorialStep(
      this.props.repository
    )
  }

  private isStepComplete = (step: ValidTutorialStep) => {
    return (
      orderedTutorialSteps.indexOf(step) <
      orderedTutorialSteps.indexOf(this.props.currentTutorialStep)
    )
  }

  private isStepNextTodo = (step: ValidTutorialStep) => {
    return step === this.props.currentTutorialStep
  }

  public componentWillReceiveProps(nextProps: ITutorialPanelProps) {
    if (this.props.currentTutorialStep !== nextProps.currentTutorialStep) {
      this.setState({
        currentlyOpenSectionId: nextProps.currentTutorialStep,
      })
    }
  }

  public render() {
    return (
      <div className="tutorial-panel-component panel">
        <div className="titleArea">
          <h3>Get started</h3>
          <img src={TutorialPanelImage} />
        </div>
        <ol>
          <TutorialStepInstructions
            summaryText="Install a text editor"
            isComplete={this.isStepComplete}
            isNextStepTodo={this.isStepNextTodo}
            sectionId={TutorialStep.PickEditor}
            currentlyOpenSectionId={this.state.currentlyOpenSectionId}
            skipLinkButton={<SkipLinkButton onClick={this.skipEditorInstall} />}
            onSummaryClick={this.onStepSummaryClick}
          >
            <p className="description">
              It doesn’t look like you have a text editor installed. We can
              recommend{' '}
              <LinkButton uri="https://atom.io" title="Open the Atom website">
                Atom
              </LinkButton>
              {` or `}
              <LinkButton
                uri="https://code.visualstudio.com"
                title="Open the VS Code website"
              >
                Visual Studio Code
              </LinkButton>
              , but feel free to use any.
            </p>
            {!this.isStepComplete(TutorialStep.PickEditor) && (
              <div className="action">
                <LinkButton onClick={this.skipEditorInstall}>
                  I have an editor
                </LinkButton>
              </div>
            )}
          </TutorialStepInstructions>
          <TutorialStepInstructions
            summaryText="Make a branch"
            isComplete={this.isStepComplete}
            isNextStepTodo={this.isStepNextTodo}
            sectionId={TutorialStep.CreateBranch}
            currentlyOpenSectionId={this.state.currentlyOpenSectionId}
            onSummaryClick={this.onStepSummaryClick}
          >
            <p className="description">
              {`Create a branch by going into the branch menu in the top bar and
              clicking "${__DARWIN__ ? 'New Branch' : 'New branch'}".`}
            </p>
            <div className="action">
              <kbd>⇧</kbd>
              <kbd>⌘</kbd>
              <kbd>N</kbd>
            </div>
          </TutorialStepInstructions>
          <TutorialStepInstructions
            summaryText="Edit a file"
            isComplete={this.isStepComplete}
            isNextStepTodo={this.isStepNextTodo}
            sectionId={TutorialStep.EditFile}
            currentlyOpenSectionId={this.state.currentlyOpenSectionId}
            onSummaryClick={this.onStepSummaryClick}
          >
            <p className="description">
              Open this repository in your preferred text editor. Edit the
              {` `}
              <Monospaced>README.md</Monospaced>
              {` `}
              file, save it, and come back.
            </p>
            {this.props.externalEditorLabel && (
              <div className="action">
                <Button
                  onClick={this.openTutorialFileInEditor}
                  disabled={!this.props.externalEditorLabel}
                >
                  {__DARWIN__ ? 'Open Editor' : 'Open editor'}
                </Button>
                <kbd>⇧</kbd>
                <kbd>⌘</kbd>
                <kbd>R</kbd>
              </div>
            )}
          </TutorialStepInstructions>
          <TutorialStepInstructions
            summaryText="Make a commit"
            isComplete={this.isStepComplete}
            isNextStepTodo={this.isStepNextTodo}
            sectionId={TutorialStep.MakeCommit}
            currentlyOpenSectionId={this.state.currentlyOpenSectionId}
            onSummaryClick={this.onStepSummaryClick}
          >
            <p className="description">
              Write a message that describes the changes you made. When you’re
              done, click the commit button to finish.
            </p>
            <div className="action">
              <kbd>⌘</kbd>
              <kbd>Enter</kbd>
            </div>
          </TutorialStepInstructions>
          <TutorialStepInstructions
            summaryText="Push to GitHub"
            isComplete={this.isStepComplete}
            isNextStepTodo={this.isStepNextTodo}
            sectionId={TutorialStep.PushBranch}
            currentlyOpenSectionId={this.state.currentlyOpenSectionId}
            onSummaryClick={this.onStepSummaryClick}
          >
            <p className="description">
              Pushing your commits updates the repository on GitHub with any
              commits made on your computer to a branch.
            </p>
            <div className="action">
              <kbd>⌘</kbd>
              <kbd>P</kbd>
            </div>
          </TutorialStepInstructions>
          <TutorialStepInstructions
            summaryText="Open a pull request"
            isComplete={this.isStepComplete}
            isNextStepTodo={this.isStepNextTodo}
            sectionId={TutorialStep.OpenPullRequest}
            currentlyOpenSectionId={this.state.currentlyOpenSectionId}
            skipLinkButton={<SkipLinkButton onClick={this.skipCreatePR} />}
            onSummaryClick={this.onStepSummaryClick}
          >
            <p className="description">
              Pull Requests are how you propose changes. By opening one, you’re
              requesting that someone review and merge them.
            </p>
            <div className="action">
              <Button onClick={this.openPullRequest}>
                {__DARWIN__ ? 'Open Pull Request' : 'Open pull request'}
              </Button>
              <kbd>⌘</kbd>
              <kbd>R</kbd>
            </div>
          </TutorialStepInstructions>
        </ol>
      </div>
    )
  }
  /** this makes sure we only have one `TutorialListItem` open at a time */
  public onStepSummaryClick = (id: ValidTutorialStep) => {
    this.setState({ currentlyOpenSectionId: id })
  }
}

interface ITutorialListItemProps {
  /** Text displayed to summarize this step */
  readonly summaryText: string
  /** Used to find out if this step has been completed */
  readonly isComplete: (step: ValidTutorialStep) => boolean
  /** The step for this section */
  readonly sectionId: ValidTutorialStep
  /** Used to find out if this is the next step for the user to complete */
  readonly isNextStepTodo: (step: ValidTutorialStep) => boolean

  /** ID of the currently expanded tutorial step
   * (used to determine if this step is expanded)
   */
  readonly currentlyOpenSectionId: ValidTutorialStep

  /** Skip button (if possible for this step) */
  readonly skipLinkButton?: JSX.Element
  /** Handler to open and close section */
  readonly onSummaryClick: (id: ValidTutorialStep) => void
}

/** A step (summary and expandable description) in the tutorial side panel */
class TutorialStepInstructions extends React.PureComponent<
  ITutorialListItemProps
> {
  public render() {
    return (
      <li key={this.props.sectionId} onClick={this.onSummaryClick}>
        <details
          open={this.props.sectionId === this.props.currentlyOpenSectionId}
          onClick={this.onSummaryClick}
        >
          {this.renderSummary()}
          <div className="contents">{this.props.children}</div>
        </details>
      </li>
    )
  }

  private renderSummary = () => {
    const shouldShowSkipLink =
      this.props.skipLinkButton !== undefined &&
      this.props.currentlyOpenSectionId === this.props.sectionId &&
      this.props.isNextStepTodo(this.props.sectionId)
    return (
      <summary>
        {this.renderTutorialStepIcon()}
        <span className="summary-text">{this.props.summaryText}</span>
        {shouldShowSkipLink ? (
          this.props.skipLinkButton
        ) : (
          <Octicon
            className="hang-right chevron-icon"
            symbol={OcticonSymbol.chevronDown}
          />
        )}
      </summary>
    )
  }

  private renderTutorialStepIcon() {
    if (this.props.isComplete(this.props.sectionId)) {
      return (
        <div className="green-circle">
          <Octicon symbol={OcticonSymbol.check} />
        </div>
      )
    }

    // ugh zero-indexing
    const stepNumber = orderedTutorialSteps.indexOf(this.props.sectionId) + 1
    return this.props.isNextStepTodo(this.props.sectionId) ? (
      <div className="blue-circle">{stepNumber}</div>
    ) : (
      <div className="empty-circle">{stepNumber}</div>
    )
  }

  private onSummaryClick = (e: React.MouseEvent<HTMLElement>) => {
    // prevents the default behavior of toggling on a `details` html element
    // so we don't have to fight it with our react state
    // for more info see:
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details#Events
    e.preventDefault()
    this.props.onSummaryClick(this.props.sectionId)
  }
}

const SkipLinkButton: React.SFC<{ onClick: () => void }> = props => (
  <LinkButton className="hang-right" onClick={props.onClick}>
    Skip
  </LinkButton>
)
