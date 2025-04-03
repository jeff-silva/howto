/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { Command, CommandRunner } from 'nest-commander';

@Command({ name: 'test', description: 'Test Command' })
export class TestCommand extends CommandRunner {
  async run(
    passedParam: string[],
    options: Record<string, any> = {},
  ): Promise<void> {
    // console.log({ passedParam, options });
  }
}
