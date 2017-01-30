import * as React from 'react'
import { Dispatcher } from '../../lib/dispatcher'
import { WelcomeStep } from './welcome'
import { LinkButton } from '../lib/link-button'
import { Checkbox, CheckboxValue } from '../lib/checkbox'
import { Form } from '../lib/form'
import { Button } from '../lib/button'

const SamplesURL = 'https://desktop.github.com/samples/'

interface IUsageOptOutProps {
  readonly dispatcher: Dispatcher
  readonly advance: (step: WelcomeStep) => void
  readonly done: () => void
  readonly optOut: boolean
}

/** The Welcome flow step for opting out of stats reporting. */
export class UsageOptOut extends React.Component<IUsageOptOutProps, void> {
  public render() {
    return (
      <Form onSubmit={this.finish}>
        <div>
          Would you like to help us improve GitHub Desktop by periodically submitting <LinkButton uri={SamplesURL}>anonymous usage data</LinkButton>?
        </div>

        <Checkbox
          label='Yes, submit anonymized usage data'
          value={this.props.optOut ? CheckboxValue.Off : CheckboxValue.On}
          onChange={this.onChange}
        />

        <Button type='submit'>Finish</Button>
        <Button onClick={this.cancel}>Cancel</Button>
      </Form>
    )
  }

  private onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.checked
    this.props.dispatcher.setStatsOptOut(!value)
  }

  private cancel = () => {
    this.props.advance(WelcomeStep.ConfigureGit)
  }

  private finish = () => {
    this.props.done()
  }
}
