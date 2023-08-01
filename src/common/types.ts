type FileProperty = {
	id: string // 1, 2, 3, 4, 5
	name: string // Название, например "Номер телефона"
	type: FilePropertyType
}

type FilePropertyType = 'text' | 'tag' | 'phone'

// Для каждого PropertyType запрашивается тип Cell и Defeninition в View (В нашем случае в таблице)\
