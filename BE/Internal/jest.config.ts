import type { Config } from '@jest/types'
import dotenv from 'dotenv'

dotenv.config({
    path: ".env.test"
});
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}

export default config