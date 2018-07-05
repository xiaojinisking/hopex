import React, { Component } from 'react'
import { Slider } from 'antd'
import { InputNumber } from "@components"
import { classNames, _ } from '@utils'
import ScrollPannel from './components/ScrollPanel'
import styles from './index.less'


export default class View extends Component {
  state = {
    orderChannel: 'order.put_limit',
    price: null,
    amount: null,
    ensureMoney: null
  }

  renderInputItem = (config = {}) => {
    const { label_name, label_desc, intro_desc, intro_price } = config
    return (
      <div className={styles.priceitem} >
        <div className={styles.priceinput} >
          <div className={styles.label} >
            <div className={styles.label_name} >{label_name}</div >
            <div className={styles.label_desc} >{label_desc}</div >
          </div >
          <InputNumber className={styles.input_number} />
        </div >
        <div className={styles.introduction} >
          <div className={styles.introduction_desc} >{intro_desc}</div >
          <div className={styles.introduction_price} >{intro_price}</div >
        </div >
      </div >
    )
  }

  renderEnsureMoney = (config = {}) => {
    const { label_buy, label_buy_price, label_sell, label_sell_price } = config
    const marks = {
      0: '',
      1: '',
      2: '',
      3: '',
      4: ''
    };
    return (
      <div className={styles.ensuremoney} >
        <Slider marks={marks} step={1} max={4} defaultValue={1} />
        <div className={styles.description} >
          <div >
            <span >{label_buy}</span >
            <span >{label_buy_price}</span ></div >
          <div >
            <span >{label_sell}</span >
            <span >{label_sell_price}</span >
          </div >
        </div >
      </div >
    )
  }

  renderSubmit = (config = {}) => {
    const { label_text, label_desc, label_price, className = {}, onSubmit } = config
    return <div
      className={classNames(
        styles.submit,
        className
      )}
      onClick={() => {
        if (_.isFunction(onSubmit)) onSubmit()
      }}
    >
      <span className={styles.text} >
        {
          label_text
        }
      </span >
      <span >
        {
          label_desc
        }
      </span >
      <span >
        {
          label_price
        }
      </span >
    </div >
  }

  renderArea = (config = {}) => {
    const { configPrice = {}, configAmount = {}, configEnsure = {}, configSubmit = {} } = config
    return (
      <div style={{}} className={styles.area} >
        {
          this.renderInputItem(configPrice)
        }
        {
          this.renderInputItem(configAmount)
        }
        {
          this.renderEnsureMoney(configEnsure)
        }
        {
          this.renderSubmit(configSubmit)
        }
      </div >
    )
  }

  render() {
    const { renderArea } = this
    const { dispatch, modelName } = this.props
    // 限价或者市价
    const configPrice = {
      label_name: '限价',
      label_desc: '最小单位0.5USD',
      intro_desc: '最高允许买价',
      intro_price: '10000.0'
    }
    // 数量
    const configAmount = {
      label_name: '数量',
      label_desc: '最小单位1张',
    }
    // 保证金
    const configEnsure = {
      label_buy: '买入保证金',
      label_buy_price: '1000',
      label_sell: '可用金额',
      label_sell_price: '1000.0'
    }
    // 交易按钮
    const configSubmit = {
      label_text: '买入',
      label_desc: '委托价值',
      label_price: '100.BTC',
      className: styles.buy,
      onSubmit: () => {
        console.log('买入')
        dispatch({
          type: `${modelName}/postSideOrder`,
          payload: {
            side: '1',
            method: 'order.put_limit'
          }
        })
      }
    }
    const configBuy = {
      configPrice,
      configAmount,
      configEnsure,
      configSubmit
    }
    const configSell = {
      configPrice: {
        ...configPrice,
        ...{
          intro_desc: '最低允许卖价',
        }
      },
      configAmount,
      configEnsure: {
        ...configEnsure,
        ...{
          label_buy: '卖出保证金',
        }
      },
      configSubmit: {
        ...configSubmit,
        ...{
          label_text: '卖出',
          className: styles.sell,
          onSubmit: () => {
            dispatch({
              type: `${modelName}/postSideOrder`,
              payload: {
                side: '2',
                method: 'order.put_limit'
              }
            })
          }
        }
      }
    }
    return (
      <div
        style={{
          flexGrow: 1
        }}
        className={
          classNames(
            {
              view: true
            },
            styles.purse
          )
        }
      >
        <ScrollPannel
          scrollConfig={{
            mouseWheel: false
          }}
          header={
            <div >交易</div >
          }
        >
          <div className={styles.content} >
            {
              renderArea(configBuy)
            }
            {
              renderArea(configSell)
            }
          </div >
        </ScrollPannel >
      </div >
    )
  }
}
