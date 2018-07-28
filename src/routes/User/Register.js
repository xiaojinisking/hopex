import React, { Component } from 'react'
import { connect } from 'dva'
import { ToastContainer, toast } from 'react-toastify'
import { ShowJsonTip, Select, Input } from '@components'
import { classNames, _ } from '@utils'
import Toast from '@components/Toast'
import { default as Structure } from './components/Structure'
import emailpng from '@assets/email.png'
import passwordpng from '@assets/password.png'
import countrypng from '@assets/country.png'
import pulldownpng from '@assets/pulldown.png'
import selectpng from '@assets/select.png'
import styles from './index.less'

@connect(({ user: model, loading, dispatch }) => ({
  model,
  modelName: 'user',
  dispatch
}))
export default class View extends Component {
  componentDidMount() {
    this.getAllCountryCode()
  }

  state = {
    countryList: [],
    page: 1,
    timeInterval: null,

    countryCode: 'CN',
    agentId: null,
    password: '8888888',
    channel: 'appstore',
    userType: 'Normal',
    packType: 'pcweb',
    email: '18353268994@qq.com',
    verificationCode: '081955',
    newPassword: '8888888'
  }


  getAllCountryCode = () => {
    const { dispatch, modelName } = this.props
    dispatch({
      type: `${modelName}/getAllCountryCode`
    }).then(res => {
      if (res) {
        this.changeState({
          countryList: res
        })
      }
    })
  }

  countDown = () => {
    if (!this.state.timeInterval) {
      this.changeState({
        timeInterval: 60
      })
    }
    this.interval = setTimeout(() => {
      const next = this.state.timeInterval - 1
      this.changeState({
        timeInterval: next
      })
      if (!next) {
        clearTimeout(this.interval)
      } else {
        this.countDown()
      }
    }, 1000)
  }

  changeState = (payload = {}) => {
    this.setState(payload)
  }

  render() {
    const { changeState, countDown } = this
    const {
      page, countryList, timeInterval,
      countryCode, password, agentId, channel, userType, packType, email, verificationCode, newPassword
    } = this.state
    const { dispatch, modelName } = this.props

    return (
      <Structure >
        <div className={styles.register} >
          {
            page === 1 ? (
              <div className={styles.page1} >
                <div className={styles.top} >
                  注册
                </div >
                <div className={styles.center} >
                  <form >
                    <Input
                      type='text'
                      placeholder={'请填写邮箱'}
                      value={email}
                      onChange={(e) => {
                        changeState({
                          email: e.target.value
                        })
                      }}
                      onClear={() => {
                        changeState({
                          email: ''
                        })
                      }}
                      iconPrefix={(
                        <img alt='email' src={emailpng} />
                      )}
                    />
                    <Input
                      type='password'
                      placeholder={'请填写密码'}
                      value={password}
                      onChange={(e) => {
                        changeState({
                          password: e.target.value
                        })
                      }}

                      onClear={() => {
                        changeState({
                          password: ''
                        })
                      }}

                      iconPrefix={(
                        <img alt='password' src={passwordpng} />
                      )}
                    />
                    <Input
                      iconPrefix={(
                        <img style={{ height: 26 }} alt='country' src={countrypng} />
                      )}
                    >
                      <Select
                        value={countryList.filter(item => item.code === countryCode)[0]}
                        onChange={(option) => changeState({ countryCode: option.code })}
                        options={countryList}
                        placeholder={'请选择国家'}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.code}
                        DropdownIndicator={(
                          <div style={{ width: 60 }} >
                            <img alt='pulldown' src={pulldownpng} />
                          </div >
                        )}
                        styles={{
                          menu: {
                            paddingRight: 20,
                          },
                          menuList: {
                            width: '90%'
                          },
                          option: {
                            borderBottom: '1px solid #EBEBEB',
                          }
                        }}
                      />
                    </Input >
                    <div className={styles.acceptence} >
                      <div className={styles.select}
                           onClick={() => {
                             changeState({
                               agentId: agentId ? null : 1
                             })
                           }}
                           style={{ border: '1px solid #EBEBEB' }}
                      >
                        {
                          agentId ? (<img alt='select' src={selectpng} />) : null
                        }
                      </div >
                      <div >接受<span >服务条款</span ></div >
                    </div >

                    <button
                      className={classNames(
                        styles.formbutton,
                        email && password && agentId ? styles.permit : styles.notpermit
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        dispatch({
                          type: `${modelName}/doRegister`,
                          payload: {
                            countryCode, password, agentId, channel, userType, packType, email
                          }
                        }).then(res => {
                          if (res) {
                            changeState({
                              page: 2
                            })
                            countDown()
                          }
                        })
                      }}
                    >
                      注册
                    </button >
                  </form >
                </div >
              </div >
            ) : (
              <div className={styles.page2} >
                <div className={styles.top} >
                  邮箱验证码
                </div >
                <div className={styles.center} >
                  <form >
                    <Input
                      type='text'
                      placeholder={'请输入验证码'}
                      value={verificationCode}
                      onChange={(e) => {
                        changeState({
                          verificationCode: e.target.value
                        })
                      }}
                      iconPrefix={(
                        <img alt='email' src={emailpng} />
                      )}
                      iconPost={(
                        <div className={styles.resend}
                             onClick={() => {
                               if (!timeInterval) this.countDown()
                             }}
                        >
                          {
                            timeInterval ? (
                              <span >重新发送({timeInterval})</span >
                            ) : '点击发送'
                          }
                        </div >
                      )}
                    />
                    <button
                      className={classNames(
                        styles.formbutton,
                        email && verificationCode ? styles.permit : styles.notpermit
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        dispatch({
                          type: `${modelName}/doRegisterVerify`,
                          payload: {
                            verificationCode, email
                          }
                        })
                      }}
                    >
                      注册
                    </button >
                  </form >
                </div >
              </div >
            )
          }
        </div >

        {/*<button onClick={(e) => {*/}
        {/*e.preventDefault()*/}
        {/*dispatch({*/}
        {/*type: `${modelName}/doVertifyLogin`,*/}
        {/*payload: {*/}
        {/*userId: '3',*/}
        {/*googleCode: '174823',*/}
        {/*loginType: 'web'*/}
        {/*}*/}
        {/*})*/}
        {/*}} >*/}
        {/*二次验证登录*/}
        {/*</button >*/}

        {/*<div >*/}
        {/*<div >*/}
        {/*<form >*/}
        {/*<input type='text' />*/}
        {/*<input type='text' />*/}
        {/*<input type='text' />*/}
        {/*<button onClick={(e) => {*/}
        {/*e.preventDefault()*/}
        {/*dispatch({*/}
        {/*type: `${modelName}/doRegister`,*/}
        {/*payload: {*/}
        {/*countryCode, password, agentId, channel, userType, packType, email*/}
        {/*}*/}
        {/*})*/}
        {/*}} >*/}
        {/*注册*/}
        {/*</button >*/}
        {/*</form >*/}
        {/*</div >*/}
        {/*<div >*/}
        {/*<form >*/}
        {/*<input type='text' />*/}
        {/*<button onClick={(e) => {*/}
        {/*e.preventDefault()*/}
        {/*dispatch({*/}
        {/*type: `${modelName}/doRegisterVerify`,*/}
        {/*payload: {*/}
        {/*email,*/}
        {/*verificationCode*/}
        {/*}*/}
        {/*})*/}
        {/*}} >*/}
        {/*注册激活*/}
        {/*</button >*/}
        {/*</form >*/}
        {/*</div >*/}
        {/*<div >*/}
        {/*<form >*/}
        {/*<input type='text' />*/}
        {/*<button onClick={(e) => {*/}
        {/*e.preventDefault()*/}
        {/*dispatch({*/}
        {/*type: `${modelName}/doEmailExists`,*/}
        {/*payload: {*/}
        {/*email*/}
        {/*}*/}
        {/*})*/}
        {/*}} >*/}
        {/*重置密码验证邮箱是否注册*/}
        {/*</button >*/}
        {/*</form >*/}
        {/*</div >*/}
        {/*<div >*/}
        {/*<form >*/}
        {/*<input type='text' />*/}
        {/*<button onClick={(e) => {*/}
        {/*e.preventDefault()*/}
        {/*dispatch({*/}
        {/*type: `${modelName}/doSendEmailCode`,*/}
        {/*payload: {*/}
        {/*email*/}
        {/*}*/}
        {/*})*/}
        {/*}} >*/}
        {/*重置密码发送邮箱验证码*/}
        {/*</button >*/}
        {/*</form >*/}
        {/*</div >*/}
        {/*<div >*/}
        {/*<form >*/}
        {/*<input type='text' />*/}
        {/*<button onClick={(e) => {*/}
        {/*e.preventDefault()*/}
        {/*dispatch({*/}
        {/*type: `${modelName}/doResetPassword`,*/}
        {/*payload: {*/}
        {/*verificationCode,*/}
        {/*email,*/}
        {/*newPassword*/}
        {/*}*/}
        {/*})*/}
        {/*}} >*/}
        {/*重置密码*/}
        {/*</button >*/}
        {/*</form >*/}
        {/*</div >*/}
        {/*<button onClick={() => {*/}
        {/*dispatch({*/}
        {/*type: `${modelName}/GetEnableGoogleVertifyCode`,*/}
        {/*payload: {}*/}
        {/*})*/}
        {/*}} >*/}
        {/*获取开启二次验证的设置信息*/}
        {/*</button >*/}
        {/*<button onClick={() => {*/}
        {/*dispatch({*/}
        {/*type: `${modelName}/doEnableGoogleVertify`,*/}
        {/*payload: {*/}
        {/*password,*/}
        {/*googleCode: '073415'*/}
        {/*}*/}
        {/*})*/}
        {/*}} >*/}
        {/*开启二次验证*/}
        {/*</button >*/}
        {/*<button onClick={() => {*/}
        {/*dispatch({*/}
        {/*type: `${modelName}/doDisbaleGoogleVertify`,*/}
        {/*payload: {*/}
        {/*password,*/}
        {/*googleCode: '650501',*/}
        {/*// loginType:'web'*/}
        {/*}*/}
        {/*})*/}
        {/*}} >*/}
        {/*关闭二次验证*/}
        {/*</button >*/}

        {/*<ShowJsonTip data={this.props.model} />*/}
        {/*</div >*/}
      </Structure >
    )
  }
}

