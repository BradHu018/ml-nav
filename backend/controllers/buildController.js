
const db = require("../config/db");

async function createBuild(req, res) {

    // takes one database connection fromMySQL connection pool
    // need it because doing multiple related SQL actions

    const connection = await db.getConnection();
    try {
        const { hero_name, 
                build_name, 
                description, 
                emblem, 
                battle_spell, 
                build_items 
            } = req.body;
            
        const userId = req.user.id;

        if (!hero_name || 
            !build_name || 
            !description || 
            !emblem || 
            !battle_spell || 
            !build_items
        ) {
            return res.status(400).json({
                message: "hero name, build name, description, emblem, battle_spell, and build_items needs to be set",
            })
        }

        if (!Array.isArray(build_items)) {
            return res.status(400).json({
                message: "build_items must be an array",
            });
        }

        if (build_items.length !== 6) {
            return res.status(400).json({
                message: "build_items must have length 6",
            });
        }

        await connection.beginTransaction();

        const [buildResult] = await connection.query(
            `
            INSERT INTO saved_builds
            (user_id, hero_name, build_name, description, emblem, battle_spell)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [userId, hero_name, build_name, description, emblem, battle_spell]
        );

        const buildId = buildResult.insertId;

        for (let i = 0; i < build_items.length; i++) {
            await connection.query(
                `
                INSERT INTO build_items
                (build_id, item_name, item_order)
                VALUES (?, ?, ?)
                `,
                [buildId, build_items[i], i + 1]
            );
        }
        
        await connection.commit();

        return res.status(201).json({
            message: "Build created successfully",
            buildId,
        });
    } catch (error) {
        await connection.rollback();

        console.error("Create build error:", error);

        return res.status(500).json({
        message: "Server error while creating build",
    });
    } finally {
        connection.release();
    }
}

async function getMyBuilds(req, res) {
    const connection = await db.getConnection();

    try{
        const userId = req.user.id; 

        const [builds] = await connection.query(
            ` 
            SELECT 
                id,
                user_id,
                hero_name,
                build_name,
                description,
                emblem,
                battle_spell,
                upvotes,
                downvotes,
                created_at
             FROM saved_builds
             WHERE user_id = ?
             ORDER BY created_at DESC
            `,
            [userId]
        );

        for (let build of builds) {
            const [items] = await connection.query(
                `
                SELECT item_name, item_order 
                FROM build_items 
                WHERE build_id = ?
                ORDER BY item_order ASC
                `,
                [build.id]
            );

            build.build_items = items.map(item => item.item_name);
        }
        return res.status(200).json({
        builds,
        });
    } catch (error) {
        console.error("Get my builds error: ", error);

        return res.status(500).json({
            message: "Server error while getting builds",
        });
    } finally {
        connection.release();
    }
    
       
}

module.exports = {
    createBuild,
    getMyBuilds,
};