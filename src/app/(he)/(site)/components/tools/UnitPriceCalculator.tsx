'use client'

import { useId, useMemo, useState } from 'react'
import {
  MAX_PRODUCTS,
  blankProduct,
  compareProducts,
  compareToText,
  dealOptions,
  defaultProducts,
  formatOver,
  formatQuantity,
  formatShekels,
  parseCount,
  parseDecimal,
  parsePriceAgorot,
  per100Label,
  perThousandLabel,
  productLabel,
  unitOptions,
  type CompareResult,
  type DealKind,
  type ProductInput,
  type UnitKind,
} from '@/lib/unit-price'
import { BizNumberField, copyText } from './BizCalcField'
import ui from './toolUi.module.css'
import biz from './BizCalc.module.css'
import styles from './UnitPriceCalculator.module.css'

const dealFields: Record<DealKind, { a: string; b: string }> = {
  none: { a: '', b: '' },
  free: { a: 'קונים (X)', b: 'מקבלים חינם (Y)' },
  second: { a: 'אחוז הנחה על השני', b: '' },
  percent: { a: 'אחוז הנחה', b: '' },
  bundle: { a: 'מספר פריטים (X)', b: 'מחיר החבילה (Y)' },
}

const numberError = (value: string, parse: (input: string) => number | null, message: string) =>
  value.trim() && parse(value) === null ? message : ''

function ProductCard({
  index,
  product,
  removable,
  onChange,
  onRemove,
}: {
  index: number
  product: ProductInput
  removable: boolean
  onChange: (patch: Partial<ProductInput>) => void
  onRemove: () => void
}) {
  const unitId = useId()
  const dealId = useId()
  const fields = dealFields[product.deal]
  const bundle = product.deal === 'bundle'

  return (
    <fieldset className={styles.product}>
      <legend className={styles.productLegend}>{productLabel(index)}</legend>
      <div className={biz.grid}>
        {bundle ? null : (
          <BizNumberField
            label="מחיר"
            suffix="₪"
            value={product.price}
            error={numberError(product.price, parsePriceAgorot, 'הקלידו מחיר חיובי.')}
            onChange={(price) => onChange({ price })}
          />
        )}
        <BizNumberField
          label="כמות באריזה"
          value={product.quantity}
          error={numberError(product.quantity, parseDecimal, 'הקלידו כמות חיובית.')}
          onChange={(quantity) => onChange({ quantity })}
        />
        <div className={ui.field}>
          <label htmlFor={unitId} className={ui.label}>
            יחידת מידה
          </label>
          <select
            id={unitId}
            className={`${ui.input} ${biz.select}`}
            value={product.unit}
            onChange={(event) => onChange({ unit: event.target.value as UnitKind })}
          >
            {unitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <BizNumberField
          label="מספר אריזות במארז"
          hint="6 בקבוקים של 330 מ״ל: הקלידו 6"
          inputMode="numeric"
          maxLength={3}
          value={product.count}
          error={numberError(product.count, parseCount, 'הקלידו מספר שלם.')}
          onChange={(count) => onChange({ count })}
        />
        <div className={ui.field}>
          <label htmlFor={dealId} className={ui.label}>
            מבצע
          </label>
          <select
            id={dealId}
            className={`${ui.input} ${biz.select}`}
            value={product.deal}
            onChange={(event) => onChange({ deal: event.target.value as DealKind, dealA: '', dealB: '' })}
          >
            {dealOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {fields.a ? (
          <BizNumberField
            label={fields.a}
            value={product.dealA}
            error={numberError(product.dealA, parseDecimal, 'הקלידו מספר.')}
            onChange={(dealA) => onChange({ dealA })}
          />
        ) : null}
        {fields.b ? (
          <BizNumberField
            label={fields.b}
            suffix={bundle ? '₪' : undefined}
            value={product.dealB}
            error={numberError(product.dealB, parseDecimal, 'הקלידו מספר.')}
            onChange={(dealB) => onChange({ dealB })}
          />
        ) : null}
      </div>
      {removable ? (
        <button type="button" className={ui.secondary} onClick={onRemove}>
          הסרת {productLabel(index)}
        </button>
      ) : null}
    </fieldset>
  )
}

function ResultList({ result }: { result: CompareResult }) {
  const counted = result.family === 'count'
  return (
    <ul className={styles.results}>
      {result.rows.map((row) => (
        <li key={row.index} className={row.best ? `${styles.result} ${styles.winner}` : styles.result}>
          <div className={styles.resultHead}>
            <span className={styles.resultName}>{productLabel(row.index)}</span>
            {row.best ? <span className={styles.badge}>הזול ביותר</span> : null}
          </div>
          {counted ? (
            <p className={styles.main}>{formatShekels(row.perUnit ?? 0)} ליחידה</p>
          ) : (
            <>
              <p className={styles.main}>
                {formatShekels(row.per100 ?? 0)} <span className={styles.per}>{per100Label(result.family)}</span>
              </p>
              <p className={styles.sub}>
                {formatShekels(row.perThousand ?? 0)} {perThousandLabel(result.family)}
              </p>
            </>
          )}
          <p className={styles.sub}>
            משלמים {formatShekels(row.paid)} על {formatQuantity(row.baseQuantity / (counted ? 1 : 1000))}{' '}
            {counted ? 'יחידות' : result.family === 'mass' ? 'ק״ג' : 'ליטר'}
          </p>
          {result.compared && !row.best ? (
            <p className={styles.over}>יקר ב-{formatOver(row.overBestPercent)} מהזול ביותר</p>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

export default function UnitPriceCalculator() {
  const [products, setProducts] = useState<ProductInput[]>(defaultProducts)
  const [status, setStatus] = useState('')
  const outcome = useMemo(() => compareProducts(products), [products])
  const patch = (index: number, change: Partial<ProductInput>) =>
    setProducts((current) => current.map((product, position) => (position === index ? { ...product, ...change } : product)))

  return (
    <section className={ui.tool} aria-label="השוואת מחיר ליחידה">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          {products.map((product, index) => (
            <ProductCard
              key={index}
              index={index}
              product={product}
              removable={products.length > 2}
              onChange={(change) => patch(index, change)}
              onRemove={() => setProducts((current) => current.filter((_, position) => position !== index))}
            />
          ))}
          {products.length < MAX_PRODUCTS ? (
            <div className={ui.actions}>
              <button
                type="button"
                className={ui.secondary}
                onClick={() => setProducts((current) => [...current, blankProduct(current[0].unit)])}
              >
                הוספת מוצר
              </button>
            </div>
          ) : null}
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>מי הזול ביותר</h2>
            {outcome.kind === 'result' ? (
              <ResultList result={outcome} />
            ) : (
              <p className={biz.message}>
                {outcome.kind === 'impossible'
                  ? outcome.message
                  : 'הקלידו מחיר וכמות לפחות לשני מוצרים כדי להשוות ביניהם.'}
              </p>
            )}
            <div className={ui.actions}>
              <button
                type="button"
                className={ui.primary}
                onClick={() =>
                  outcome.kind === 'result'
                    ? copyText(compareToText(outcome), setStatus, 'התוצאה הועתקה')
                    : setStatus('השלימו את השדות כדי להעתיק את התוצאה.')
                }
              >
                העתקת התוצאה
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>ההשוואה אפשרית בין מוצרים באותו סוג מידה. החישוב נעשה בדפדפן.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
