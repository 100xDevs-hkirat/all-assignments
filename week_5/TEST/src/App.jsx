import './App.css'
import { Button, Card, Typography } from '@mui/material'
import { RecoilRoot, atom, useRecoilState, useSetRecoilState } from 'recoil'

function App() {


  return (
    <RecoilRoot>
      <div style={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Card style={{
          padding: 20,
          width: 500
        }}>
          <Typography variant='h5'>Welcome to the counter game</Typography>
          <br />
          <Buttons />
          <CountComponent />
        </Card>
      </div>
    </RecoilRoot>

  )
  function Buttons() {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <IncreaseCount />
        <DecreaseCount />
      </div>
    )
  }
  function IncreaseCount() {
    const setCount = useSetRecoilState(countState)
    return (
      <div>
        <Button variant='contained' onClick={() => setCount((existingCount) => existingCount + 1)}>Increase Count</Button>
      </div>
    )
  }
  function DecreaseCount() {
    const setCount = useSetRecoilState(countState)
    return (
      <div>
        <Button variant='contained' onClick={() => setCount((existingCount) => existingCount - 1)}>Decrease Count</Button>
      </div>
    )
  }
  function CountComponent() {
    const count = useRecoilState(countState)
    return (
      <div style={{ textAlign: 'center' }}>
        {count}
      </div>
    )
  }

}


export default App

const countState = atom({
  key: 'countState', // unique ID (with respect to other atoms/selectors)
  default: 0, // default value (aka initial value)
});