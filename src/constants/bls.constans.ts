export const statusBls = {
    inactive: { value: "inactive", esLabel: "Inactivo", enLabel: "Inactive", color: '#0dcaf0' },
    assignedPort: { value: "assignedPort", esLabel: "Asignado a puerto", enLabel: "Assigned to port", color: '#fd7e14' },
    assignedTrip: { value: "assignedTrip", esLabel: "Asignado a viaje", enLabel: "Assigned to trip", color: '#ffc107' },
    exitReviewPort: { value: "exitReview", esLabel: "Revisión de salida", enLabel: "Exit review", color: '#20c997' },
    returnReviewPort: { value: "returnPort", esLabel: "Regreso a puerto", enLabel: "Return port", color: '#6f42c1' },
    exitReviewTrip: { value: "exitReviewTrip", esLabel: "Revisión de salid", enLabel: "Exit review", color: '#0d6efd' },
    returnReviewTrip: { value: "returnReviewTrip", esLabel: "Regreso a patio", enLabel: "Return port", color: '#6f42c1' },
}

export const blsAggregate = [
    {
        $lookup: {
            from: 'valuelists',
            localField: 'typeLoad',
            foreignField: '_id',
            as: 'typeLoad'
        }
    },
    {
        $unwind: {
            path: '$typeLoad',
            preserveNullAndEmptyArrays: true
        }
    },
        {
        $lookup: {
            from: 'valuelists',
            localField: 'destination',
            foreignField: '_id',
            as: 'destination'
        }
    },
    {
        $unwind: {
            path: '$destination',
            preserveNullAndEmptyArrays: true
        }
    }
];

export const blsAggregateAssignPort = [
    {
        $lookup: {
            from: 'operators',
            localField: 'operator',
            foreignField: '_id',
            as: 'operator'
        }
    },
    {
        $unwind: {
            path: '$operator',
            preserveNullAndEmptyArrays: true
        }
    },
        {
        $lookup: {
            from: 'motortransports',
            localField: 'motorTransport',
            foreignField: '_id',
            as: 'motorTransport'
        }
    },
    {
        $unwind: {
            path: '$motorTransport',
            preserveNullAndEmptyArrays: true
        }
    }
];

export const blsAggregateAssignTrip = [
    {
        $lookup: {
            from: 'operators',
            localField: 'operator',
            foreignField: '_id',
            as: 'operator'
        }
    },
    {
        $unwind: {
            path: '$operator',
            preserveNullAndEmptyArrays: true
        }
    },
        {
        $lookup: {
            from: 'motortransports',
            localField: 'motorTransport',
            foreignField: '_id',
            as: 'motorTransport'
        }
    },
    {
        $unwind: {
            path: '$motorTransport',
            preserveNullAndEmptyArrays: true
        }
    },
            {
        $lookup: {
            from: 'valuelists',
            localField: 'origin',
            foreignField: '_id',
            as: 'origin'
        }
    },
    {
        $unwind: {
            path: '$origin',
            preserveNullAndEmptyArrays: true
        }
    },
            {
        $lookup: {
            from: 'valuelists',
            localField: 'destination',
            foreignField: '_id',
            as: 'destination'
        }
    },
    {
        $unwind: {
            path: '$destination',
            preserveNullAndEmptyArrays: true
        }
    }
];
