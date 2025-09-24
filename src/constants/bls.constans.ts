export const statusBls = {
    inactive: { value: "inactive", esLabel: "Inactivo", enLabel: "Inactive", color: '#0dcaf0' },
    assignedPort: { value: "assignedPort", esLabel: "Asignado a puerto", enLabel: "Assigned to port", color: '#fd7e14' }
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
