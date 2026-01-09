import { useState, useEffect } from 'react'
import { Database, Eye, EyeOff } from 'lucide-react'

const databaseTypes = [
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'redis', label: 'Redis' },
]

const operationTypes = [
  { value: 'query', label: 'Query / Find' },
  { value: 'insert', label: 'Insert' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
]

export default function DatabaseAction({ config, onChange }) {
  const [dbType, setDbType] = useState(config.dbType || 'mongodb')
  const [operation, setOperation] = useState(config.operation || 'query')
  const [connectionString, setConnectionString] = useState(config.connectionString || '')
  const [database, setDatabase] = useState(config.database || '')
  const [collection, setCollection] = useState(config.collection || '')
  const [query, setQuery] = useState(config.query || '')
  const [data, setData] = useState(config.data || '')
  const [showConnection, setShowConnection] = useState(false)

  useEffect(() => {
    onChange({
      dbType,
      operation,
      connectionString,
      database,
      collection,
      query,
      data,
    })
  }, [dbType, operation, connectionString, database, collection, query, data])

  const getPlaceholder = () => {
    if (dbType === 'mongodb') {
      return operation === 'query' ? '{ "status": "active" }' : '{ "name": "John", "age": 30 }'
    }
    return operation === 'query' ? 'SELECT * FROM users WHERE status = "active"' : 'INSERT INTO users (name, age) VALUES ("John", 30)'
  }

  return (
    <div className="space-y-3!">
      <div className="grid! grid-cols-2! gap-3!">
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            <Database size={14} className="inline! mr-1!" />
            Database Type
          </label>
          <select
            value={dbType}
            onChange={(e) => setDbType(e.target.value)}
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          >
            {databaseTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Operation
          </label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          >
            {operationTypes.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="flex! items-center! justify-between! mb-2!">
          <label className="block! text-sm! text-[#999999]!">
            Connection String
          </label>
          <button
            onClick={() => setShowConnection(!showConnection)}
            className="text-xs! text-[#85409D]! hover:text-[#a855f7]! flex! items-center! gap-1!"
          >
            {showConnection ? <EyeOff size={12} /> : <Eye size={12} />}
            {showConnection ? 'Hide' : 'Show'}
          </button>
        </div>
        <input
          type={showConnection ? 'text' : 'password'}
          value={connectionString}
          onChange={(e) => setConnectionString(e.target.value)}
          placeholder={
            dbType === 'mongodb' ? 'mongodb://username:password@host:port' :
            dbType === 'postgresql' ? 'postgresql://username:password@host:port/database' :
            dbType === 'mysql' ? 'mysql://username:password@host:port/database' :
            'Connection string'
          }
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! font-mono!"
        />
      </div>

      <div className="grid! grid-cols-2! gap-3!">
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Database Name
          </label>
          <input
            type="text"
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
            placeholder="my_database"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          />
        </div>

        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            {dbType === 'mongodb' ? 'Collection' : 'Table'}
          </label>
          <input
            type="text"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            placeholder={dbType === 'mongodb' ? 'users' : 'users'}
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          />
        </div>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          {operation === 'query' ? 'Query' : operation === 'update' ? 'Filter' : 'Condition'}
        </label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={getPlaceholder()}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! font-mono! h-24!"
        />
      </div>

      {(operation === 'insert' || operation === 'update') && (
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Data {operation === 'insert' ? 'to Insert' : 'to Update'}
          </label>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder={dbType === 'mongodb' ? '{ "name": "John", "age": 30 }' : 'name = "John", age = 30'}
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! font-mono! h-24!"
          />
        </div>
      )}

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <h4 className="text-xs! font-semibold! text-[#e0e0e0]! mb-2!">
          Configuration Summary
        </h4>
        <p className="text-xs! text-[#999999]!">
          Perform <strong className="text-[#85409D]!">{operation}</strong> operation on{' '}
          <strong className="text-[#85409D]!">{dbType}</strong>
          {collection && ` in ${collection}`}
          {database && ` (${database})`}
        </p>
      </div>

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-yellow-600/30!">
        <p className="text-xs! text-[#999999]!">
          <strong className="text-yellow-500!">Security:</strong> Connection strings with credentials will be encrypted and stored securely.
        </p>
      </div>
    </div>
  )
}

DatabaseAction.defaultConfig = {
  dbType: 'mongodb',
  operation: 'query',
  connectionString: '',
  database: '',
  collection: '',
  query: '',
  data: ''
}
