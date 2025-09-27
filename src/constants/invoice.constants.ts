export const invoiceAggregate = [
  {
    $lookup: {
      from: 'valuelists',
      localField: 'issuing',
      foreignField: '_id',
      as: 'issuing',
    },
  },
  { $unwind: { path: '$issuing', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'valuelists',
      localField: 'typeReceipt',
      foreignField: '_id',
      as: 'typeReceipt',
    },
  },
  { $unwind: { path: '$typeReceipt', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'valuelists',
      localField: 'useVoucher',
      foreignField: '_id',
      as: 'useVoucher',
    },
  },
  { $unwind: { path: '$useVoucher', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'valuelists',
      localField: 'methodOfPayment',
      foreignField: '_id',
      as: 'methodOfPayment',
    },
  },
  { $unwind: { path: '$methodOfPayment', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'valuelists',
      localField: 'paymentMethod',
      foreignField: '_id',
      as: 'paymentMethod',
    },
  },
  { $unwind: { path: '$paymentMethod', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'valuelists',
      localField: 'currency',
      foreignField: '_id',
      as: 'currency',
    },
  },
  { $unwind: { path: '$currency', preserveNullAndEmptyArrays: true } },
  { $unwind: { path: '$relatedInvoices', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'valuelists',
      localField: 'relatedInvoices.relationshipType',
      foreignField: '_id',
      as: 'relatedInvoices.relationshipType',
    },
  },
  { $unwind: { path: '$relatedInvoices.relationshipType', preserveNullAndEmptyArrays: true } },
  {
    $group: {
      _id: '$_id',
      doc: { $first: '$$ROOT' },
      relatedInvoices: { $push: '$relatedInvoices' },
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: ['$doc', { relatedInvoices: '$relatedInvoices' }],
      },
    },
  },
];
