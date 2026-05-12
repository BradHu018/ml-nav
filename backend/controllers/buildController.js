
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
                is_public,
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
            (user_id, hero_name, build_name, description, emblem, battle_spell, is_public)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [userId, hero_name, build_name, description, emblem, battle_spell, is_public === false ? false : true]
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
                is_public,
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

async function updateBuild(req, res) {
    const connection = await db.getConnection();

    try {

        const buildId = req.params.id;

        const { hero_name, 
                build_name, 
                description, 
                emblem, 
                battle_spell, 
                is_public,
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
    
        const [updated_build] = await connection.query(
            `
            UPDATE saved_builds
            SET hero_name = ?, 
                build_name = ?,
                description = ?, 
                emblem = ?, 
                battle_spell = ?,
                is_public = ?
            WHERE id = ? AND user_id = ? 
            `,
            [hero_name, build_name, description, emblem, battle_spell, is_public === false ? false : true, buildId, userId]
        );

        if (updated_build.affectedRows === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "Build not found or you do not own this build",
            })
        }

        await connection.query(
            `DELETE FROM build_items 
            WHERE build_id = ?
            `,
            [buildId]
        );

        for (let i = 0; i < build_items.length; i++) {
            await connection.query(
                `
                INSERT INTO build_items 
                (build_id, item_name, item_order)
                VALUES (?, ?, ?)
                `, 
                [buildId, build_items[i], i + 1]
            )
        }
        await connection.commit();

        return res.status(200).json({
            message: "Build updated successfully",
            buildId,
        })
    } catch (error) {
        await connection.rollback();

        console.error("Update build error: ", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    } finally {
        connection.release();
    }
}

async function deleteBuild(req, res) {
    const connection = await db.getConnection();

    try {
        const buildId = req.params.id;

        console.log("REQ PARAMS:", req.params);
        console.log("REQ USER:", req.user);


        const userId = req.user.id;

        await connection.beginTransaction(); 

        const [deleted_build] = await connection.query(
            `
            DELETE FROM saved_builds 
            WHERE id = ? AND user_id = ?
            `, 
            [buildId, userId]

        );

        if (deleted_build.affectedRows === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "Build not not found or you do not own this build"
            });
        }

        await connection.commit();

        return res.status(200).json({
            message: "Build deleted successfully"
        });
    } catch (error) {
        await connection.rollback();

        console.error("Delete build error: ", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    } finally {
        connection.release();
    }
}

async function getTopBuilds(req, res){
    try {
        const limit = Number(req.query.limit) || 6;

        const safeLimit = Math.min(limit, 10);

        const [rows] = await db.query(
            `
            SELECT 
                sb.id,
                sb.user_id,
                u.username,
                sb.hero_name,
                sb.build_name,
                sb.description,
                sb.emblem,
                sb.battle_spell,
                sb.upvotes,
                sb.downvotes,
                sb.is_public,
                sb.created_at,
                GROUP_CONCAT(bi.item_name ORDER BY bi.item_order SEPARATOR ',') AS build_items
            FROM saved_builds sb
            JOIN users u ON sb.user_id = u.id
            LEFT JOIN build_items bi ON sb.id = bi.build_id
            WHERE sb.is_public = TRUE
            GROUP BY sb.id
            ORDER BY sb.upvotes DESC, sb.created_at DESC
            LIMIT ?
            `,
            [safeLimit]
        );

        const builds = rows.map((build) => ({
            ...build, 
            build_items: build.build_items ? build.build_items.split(",") : [],
        }));

        return res.status(200).json({ builds });
    } catch (error) {
        console.error("Get top builds error: ", error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

async function searchBuildsByHero(req, res) {
    try {
        const hero = req.query.hero;
        const limit = Number(req.query.limit) || 10;

        if (!hero) {
            return res.status(400).json({
                message: "Hero search query is required",
            });
        }

        const safeLimit = Math.min(limit, 10);

        const [rows] = await db.query(
        `
        SELECT 
            sb.id,
            sb.user_id,
            u.username,
            sb.hero_name,
            sb.build_name,
            sb.description,
            sb.emblem,
            sb.battle_spell,
            sb.upvotes,
            sb.downvotes,
            sb.is_public,
            sb.created_at,
            GROUP_CONCAT(bi.item_name ORDER BY bi.item_order SEPARATOR ',') AS build_items
        FROM saved_builds sb
        JOIN users u ON sb.user_id = u.id
        LEFT JOIN build_items bi ON sb.id = bi.build_id
        WHERE sb.is_public = TRUE
            AND sb.hero_name LIKE ?
        GROUP BY sb.id
        ORDER BY sb.upvotes DESC, sb.created_at DESC
        LIMIT ?
        `,
        [`%${hero}%`, safeLimit]
        );

        const builds = rows.map((build) => ({
            ...build,
            build_items: build.build_items ? build.build_items.split(",") : [],
        }));

        return res.status(200).json({builds});

    } catch(error) {
        console.error("Search builds error:", error);

        return res.status(500).json({
        message: "Internal server error",
    });
    }
}

async function upvoteBuild(req, res) {
    let connection; 

    try {

        connection = await db.getConnection();

        const buildId = req.params.id;
        const userId = req.user.id;

        await connection.beginTransaction();

        const [buildRows] = await connection.query(
            `
            SELECT id, user_id, is_public, upvotes
            FROM saved_builds
            WHERE id = ?
            `,
            [buildId]
        );

        if (buildRows.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "Build not found",
            });
        }

        const build = buildRows[0];

        if (!build.is_public) {
            await connection.rollback();

            return res.status(403).json({
                message: "You cannot upvote a private build",
            });
        }

        if (Number(build.user_id) === Number(userId)) {
            await connection.rollback();

            return res.status(403).json({
                message: "You cannot upvote your own build",
            });
        }

        const [existingVoteRows] = await connection.query(
            `
            SELECT id
            FROM build_votes
            WHERE build_id = ? AND user_id = ?
            `,
            [buildId, userId]
        );

        if (existingVoteRows.length > 0) {
            await connection.rollback();

            return res.status(409).json({
                message: "You already upvoted this build",
                upvotes: build.upvotes,
            });
        }

        await connection.query(
            `
            INSERT INTO build_votes (build_id, user_id, vote_type)
            VALUES (?, ?, 'upvote')
            `,
            [buildId, userId]
        );

        await connection.query(
            `
            UPDATE saved_builds
            SET upvotes = upvotes + 1
            WHERE id = ?
            `,
            [buildId]
        );

        const [updatedRows] = await connection.query(
            `
            SELECT upvotes
            FROM saved_builds
            WHERE id = ?
            `,
            [buildId]
        );

        await connection.commit();

        return res.status(200).json({
            message: "Build upvoted successfully",
            upvotes: updatedRows[0].upvotes,
        });
    } catch (error) {
        await connection.rollback();

        console.error("Upvote build error:", error);
        
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "You already upvoted this build",
            });
        }

        return res.status(500).json({
            message: "Internal server error while upvoting build",
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}


module.exports = {
    createBuild,
    getMyBuilds,
    updateBuild,
    deleteBuild,
    getTopBuilds,
    searchBuildsByHero,
    upvoteBuild,
};