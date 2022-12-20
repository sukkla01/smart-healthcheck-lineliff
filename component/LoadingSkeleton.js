import React, { useEffect, useState } from 'react'
import { Avatar, List, Skeleton, Switch } from 'antd';

function LoadingSkeleton() {
    const [loading, setLoading] = useState(true);

    return (
        <Skeleton loading={loading} active avatar>
            <List.Item.Meta
                avatar={<Avatar src={'https://joeschmoe.io/api/v1/random'} />}
                title={<a href='#'>xxxxxxxx</a>}
                description={'ddddd'}
            />
            xxxxxxxxxxxxxxx
        </Skeleton>
    )
}

export default LoadingSkeleton